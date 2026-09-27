import { eq, isNull } from 'drizzle-orm';
import { db, esRechazoPorClaveForanea } from '$lib/server/db';
import { nombresNivel, ubicaciones } from './tablas';

export { ubicaciones };

export type Ubicacion = typeof ubicaciones.$inferSelect;

export type NodoUbicacion = Ubicacion & { hijas: NodoUbicacion[] };

export type UbicacionConRuta = { id: number; ruta: string };

export type NombresNivel = [string, string, string];

export type Resultado<T = void> = { ok: true; valor: T } | { ok: false; error: string };

const NIVEL_MAXIMO = 3;
const NOMBRES_PREDETERMINADOS: NombresNivel = ['Pasillo', 'Estantería', 'Estante'];

// Orden natural: "Estante 2" antes que "Estante 10", sin distinguir mayúsculas ni acentos.
function compararNombres(a: string, b: string): number {
	return a.localeCompare(b, 'es', { numeric: true, sensitivity: 'base' });
}

function limpiarNombre(nombre: string): Resultado<string> {
	const limpio = nombre.trim();
	if (!limpio) return { ok: false, error: 'El nombre es obligatorio.' };
	return { ok: true, valor: limpio };
}

function obtener(id: number): Ubicacion | undefined {
	return db.select().from(ubicaciones).where(eq(ubicaciones.id, id)).get();
}

// Los hermanos comparten padre; los de nivel 1 (sin padre) son hermanos entre sí.
// Se compara con el mismo criterio que el orden, así "pasillo a" repite a "Pasillo A".
function existeHermana(padreId: number | null, nombre: string, excluirId?: number): boolean {
	const hermanas = db
		.select({ id: ubicaciones.id, nombre: ubicaciones.nombre })
		.from(ubicaciones)
		.where(padreId === null ? isNull(ubicaciones.padreId) : eq(ubicaciones.padreId, padreId))
		.all();
	return hermanas.some((h) => h.id !== excluirId && compararNombres(h.nombre, nombre) === 0);
}

function errorRepetido(nombre: string): Resultado<never> {
	return { ok: false, error: `Ya existe «${nombre}» en el mismo lugar.` };
}

export function crear(datos: { nombre: string; padreId?: number | null }): Resultado<Ubicacion> {
	const nombre = limpiarNombre(datos.nombre);
	if (!nombre.ok) return nombre;

	const padreId = datos.padreId ?? null;
	let nivel = 1;
	if (padreId !== null) {
		const padre = obtener(padreId);
		if (!padre) return { ok: false, error: 'La ubicación superior no existe.' };
		if (padre.nivel >= NIVEL_MAXIMO) {
			return { ok: false, error: `No se pueden crear ubicaciones por debajo del nivel ${NIVEL_MAXIMO}.` };
		}
		nivel = padre.nivel + 1;
	}

	if (existeHermana(padreId, nombre.valor)) return errorRepetido(nombre.valor);

	const ubicacion = db
		.insert(ubicaciones)
		.values({ nombre: nombre.valor, nivel, padreId })
		.returning()
		.get();
	return { ok: true, valor: ubicacion };
}

export function renombrar(id: number, nombreNuevo: string): Resultado<Ubicacion> {
	const nombre = limpiarNombre(nombreNuevo);
	if (!nombre.ok) return nombre;

	const actual = obtener(id);
	if (!actual) return { ok: false, error: 'La ubicación no existe.' };
	if (existeHermana(actual.padreId, nombre.valor, id)) return errorRepetido(nombre.valor);

	const ubicacion = db
		.update(ubicaciones)
		.set({ nombre: nombre.valor })
		.where(eq(ubicaciones.id, id))
		.returning()
		.get();
	return { ok: true, valor: ubicacion };
}

export function eliminar(id: number): Resultado {
	const hija = db
		.select({ id: ubicaciones.id })
		.from(ubicaciones)
		.where(eq(ubicaciones.padreId, id))
		.get();
	if (hija) return { ok: false, error: 'No se puede eliminar: tiene ubicaciones adentro.' };

	try {
		db.delete(ubicaciones).where(eq(ubicaciones.id, id)).run();
	} catch (e) {
		// La base rechaza el borrado cuando otra tabla referencia a la ubicación.
		if (esRechazoPorClaveForanea(e)) return { ok: false, error: 'No se puede eliminar: está en uso' };
		throw e;
	}
	return { ok: true, valor: undefined };
}

export function listarArbol(): NodoUbicacion[] {
	const nodos = new Map<number, NodoUbicacion>();
	for (const u of db.select().from(ubicaciones).all()) nodos.set(u.id, { ...u, hijas: [] });

	const raices: NodoUbicacion[] = [];
	for (const nodo of nodos.values()) {
		const padre = nodo.padreId === null ? undefined : nodos.get(nodo.padreId);
		(padre ? padre.hijas : raices).push(nodo);
	}

	const ordenar = (lista: NodoUbicacion[]) => {
		lista.sort((a, b) => compararNombres(a.nombre, b.nombre));
		for (const nodo of lista) ordenar(nodo.hijas);
	};
	ordenar(raices);
	return raices;
}

export function obtenerRuta(id: number): string | undefined {
	const nombres: string[] = [];
	let actual = obtener(id);
	if (!actual) return undefined;
	while (actual) {
		nombres.unshift(actual.nombre);
		actual = actual.padreId === null ? undefined : obtener(actual.padreId);
	}
	return nombres.join(' > ');
}

export function listarNivel3(): UbicacionConRuta[] {
	const todas = new Map(db.select().from(ubicaciones).all().map((u) => [u.id, u]));
	const ruta = (u: Ubicacion): string => {
		const padre = u.padreId === null ? undefined : todas.get(u.padreId);
		return padre ? `${ruta(padre)} > ${u.nombre}` : u.nombre;
	};
	return [...todas.values()]
		.filter((u) => u.nivel === NIVEL_MAXIMO)
		.map((u) => ({ id: u.id, ruta: ruta(u) }))
		.sort((a, b) => compararNombres(a.ruta, b.ruta));
}

export function obtenerNombresNivel(): NombresNivel {
	const nombres: NombresNivel = [...NOMBRES_PREDETERMINADOS];
	for (const fila of db.select().from(nombresNivel).all()) {
		if (fila.nivel >= 1 && fila.nivel <= NIVEL_MAXIMO) nombres[fila.nivel - 1] = fila.nombre;
	}
	return nombres;
}

export function cambiarNombresNivel(nombres: NombresNivel): Resultado<NombresNivel> {
	const limpios = nombres.map((n) => n.trim());
	if (limpios.some((n) => !n)) return { ok: false, error: 'Los tres nombres de nivel son obligatorios.' };

	db.transaction((tx) => {
		limpios.forEach((nombre, i) => {
			tx.insert(nombresNivel)
				.values({ nivel: i + 1, nombre })
				.onConflictDoUpdate({ target: nombresNivel.nivel, set: { nombre } })
				.run();
		});
	});
	return { ok: true, valor: limpios as NombresNivel };
}
