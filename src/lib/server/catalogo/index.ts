import { eq, sql } from 'drizzle-orm';
import { db } from '$lib/server/db';
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

// La base rechaza el borrado cuando otra tabla referencia al producto.
function esRechazoPorReferencia(e: unknown): boolean {
	return e instanceof Error && 'code' in e && e.code === 'SQLITE_CONSTRAINT_FOREIGNKEY';
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
		if (esRechazoPorReferencia(e)) return { ok: false, error: 'No se puede eliminar: está en uso' };
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
