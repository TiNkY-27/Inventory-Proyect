import { and, eq, inArray } from 'drizzle-orm';
import { db } from '$lib/server/db';
import * as catalogo from '$lib/server/catalogo';
import * as ubicaciones from '$lib/server/ubicaciones';
import { stock } from './tablas';

export { stock };

export type StockEnUbicacion = { ubicacionId: number; ruta: string; cantidad: number };

export type StockDeProducto = { ubicaciones: StockEnUbicacion[]; total: number };

export type Resultado<T = void> = { ok: true; valor: T } | { ok: false; error: string };

// Deja la cantidad exacta de un producto en una ubicación de nivel 3; con 0 se quita el registro.
export function fijarCantidad(productoId: number, ubicacionId: number, cantidad: number): Resultado {
	if (!Number.isInteger(cantidad)) return { ok: false, error: 'La cantidad debe ser un número entero.' };
	if (cantidad < 0) return { ok: false, error: 'La cantidad no puede ser negativa.' };
	if (!catalogo.obtenerPorId(productoId)) return { ok: false, error: 'El producto no existe.' };
	if (!ubicaciones.listarNivel3().some((u) => u.id === ubicacionId)) {
		return { ok: false, error: 'Solo se puede asignar stock a ubicaciones del último nivel.' };
	}

	const clave = and(eq(stock.productoId, productoId), eq(stock.ubicacionId, ubicacionId));
	if (cantidad === 0) {
		db.delete(stock).where(clave).run();
	} else {
		db.insert(stock)
			.values({ productoId, ubicacionId, cantidad })
			.onConflictDoUpdate({ target: [stock.productoId, stock.ubicacionId], set: { cantidad } })
			.run();
	}
	return { ok: true, valor: undefined };
}

export function obtenerStockDeProducto(productoId: number): StockDeProducto {
	const filas = db.select().from(stock).where(eq(stock.productoId, productoId)).all();
	const cantidades = new Map(filas.map((f) => [f.ubicacionId, f.cantidad]));

	// listarNivel3 ya viene ordenado por ruta; se conservan solo las ubicaciones con stock.
	const conStock = ubicaciones
		.listarNivel3()
		.filter((u) => cantidades.has(u.id))
		.map((u) => ({ ubicacionId: u.id, ruta: u.ruta, cantidad: cantidades.get(u.id)! }));

	return {
		ubicaciones: conStock,
		total: conStock.reduce((suma, u) => suma + u.cantidad, 0)
	};
}

// Stock de varios productos con una sola consulta a la tabla de stock.
// Devuelve una entrada por cada id pedido (sin stock: lista vacía y total 0).
export function obtenerStockDeProductos(productoIds: number[]): Map<number, StockDeProducto> {
	const resultado = new Map<number, StockDeProducto>(
		productoIds.map((id) => [id, { ubicaciones: [], total: 0 }])
	);
	if (productoIds.length === 0) return resultado;

	const filas = db.select().from(stock).where(inArray(stock.productoId, productoIds)).all();
	// listarNivel3 viene ordenado por ruta; su posición da el mismo orden que obtenerStockDeProducto.
	const estantes = new Map(ubicaciones.listarNivel3().map((u, posicion) => [u.id, { ...u, posicion }]));

	for (const fila of filas) {
		const estante = estantes.get(fila.ubicacionId);
		const entrada = resultado.get(fila.productoId);
		if (!estante || !entrada) continue;
		entrada.ubicaciones.push({ ubicacionId: estante.id, ruta: estante.ruta, cantidad: fila.cantidad });
		entrada.total += fila.cantidad;
	}
	const posicion = (id: number) => estantes.get(id)!.posicion;
	for (const entrada of resultado.values()) {
		entrada.ubicaciones.sort((a, b) => posicion(a.ubicacionId) - posicion(b.ubicacionId));
	}
	return resultado;
}
