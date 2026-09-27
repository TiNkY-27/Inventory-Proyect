import { eq, or, sql, type AnyColumn } from 'drizzle-orm';
import { db, esRechazoPorClaveForanea } from '$lib/server/db';
import { productos } from './tablas';

export { productos };

export type Producto = typeof productos.$inferSelect;

export type DatosProducto = {
	nombre: string;
	marca?: string | null;
	categoria?: string | null;
};

export type Resultado<T = void> = { ok: true; valor: T } | { ok: false; error: string };

type Valores = Omit<Producto, 'id'>;

function validar(datos: DatosProducto): Resultado<Valores> {
	const nombre = datos.nombre.trim();
	if (!nombre) return { ok: false, error: 'El nombre es obligatorio.' };
	return {
		ok: true,
		valor: {
			nombre,
			marca: opcional(datos.marca),
			categoria: opcional(datos.categoria)
		}
	};
}

function opcional(texto: string | null | undefined): string | null {
	const limpio = texto?.trim();
	return limpio ? limpio : null;
}

export function crear(datos: DatosProducto): Resultado<Producto> {
	const validado = validar(datos);
	if (!validado.ok) return validado;
	const producto = db.insert(productos).values(validado.valor).returning().get();
	return { ok: true, valor: producto };
}

export function editar(id: number, datos: DatosProducto): Resultado<Producto> {
	const validado = validar(datos);
	if (!validado.ok) return validado;
	const producto = db
		.update(productos)
		.set(validado.valor)
		.where(eq(productos.id, id))
		.returning()
		.get();
	if (!producto) return { ok: false, error: 'El producto no existe.' };
	return { ok: true, valor: producto };
}

export function eliminar(id: number): Resultado {
	try {
		db.delete(productos).where(eq(productos.id, id)).run();
	} catch (e) {
		// La base rechaza el borrado cuando otra tabla referencia al producto.
		if (esRechazoPorClaveForanea(e)) return { ok: false, error: 'No se puede eliminar: está en uso' };
		throw e;
	}
	return { ok: true, valor: undefined };
}

export function obtenerPorId(id: number): Producto | undefined {
	return db.select().from(productos).where(eq(productos.id, id)).get();
}

export function listarTodos(): Producto[] {
	return db
		.select()
		.from(productos)
		.orderBy(sql`lower(${productos.nombre})`, productos.id)
		.all();
}

const MAXIMO_RESULTADOS = 50;

// Coincidencia parcial en nombre, marca o categoría, sin distinguir mayúsculas.
// Los acentos no se normalizan: "latex" no encuentra "Látex".
export function buscar(texto: string): Producto[] {
	const buscado = texto.trim().toLowerCase();
	if (!buscado) return [];
	// % y _ son comodines de LIKE: se escapan para buscarlos como texto.
	const patron = `%${buscado.replace(/[\\%_]/g, '\\$&')}%`;
	const contiene = (columna: AnyColumn) =>
		sql`lower(${columna}) like ${patron} escape '\\'`;
	return db
		.select()
		.from(productos)
		.where(or(contiene(productos.nombre), contiene(productos.marca), contiene(productos.categoria)))
		.orderBy(sql`lower(${productos.nombre})`, productos.id)
		.limit(MAXIMO_RESULTADOS)
		.all();
}
