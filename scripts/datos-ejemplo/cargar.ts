// Vacía la base y carga los datos de ejemplo, solo con las funciones de los bloques.
// Uso: npm run db:seed (solo para desarrollo, sobre una base ya migrada).

import * as catalogo from '$lib/server/catalogo';
import * as stock from '$lib/server/stock';
import * as ubicaciones from '$lib/server/ubicaciones';
import * as datos from './datos';

type Resultado<T> = { ok: true; valor: T } | { ok: false; error: string };

function exigir<T>(resultado: Resultado<T>, que: string): T {
	if (!resultado.ok) throw new Error(`${que}: ${resultado.error}`);
	return resultado.valor;
}

function vaciar() {
	// 1. Stock en 0 para cada producto (así la base deja borrar productos y ubicaciones).
	for (const producto of catalogo.listarTodos()) {
		for (const u of stock.obtenerStockDeProducto(producto.id).ubicaciones) {
			exigir(stock.fijarCantidad(producto.id, u.ubicacionId, 0), `Quitar stock de «${producto.nombre}»`);
		}
	}

	// 2. Ubicaciones, del nivel 3 al 1 (una ubicación con hijas no se puede eliminar).
	const porNivel = new Map<number, ubicaciones.NodoUbicacion[]>();
	const recorrer = (nodos: ubicaciones.NodoUbicacion[]) => {
		for (const nodo of nodos) {
			porNivel.set(nodo.nivel, [...(porNivel.get(nodo.nivel) ?? []), nodo]);
			recorrer(nodo.hijas);
		}
	};
	recorrer(ubicaciones.listarArbol());
	for (const nivel of [3, 2, 1]) {
		for (const nodo of porNivel.get(nivel) ?? []) {
			exigir(ubicaciones.eliminar(nodo.id), `Eliminar la ubicación «${nodo.nombre}»`);
		}
	}

	// 3. Productos.
	for (const producto of catalogo.listarTodos()) {
		exigir(catalogo.eliminar(producto.id), `Eliminar el producto «${producto.nombre}»`);
	}

	// 4. Nombres de nivel predeterminados.
	exigir(ubicaciones.cambiarNombresNivel(datos.nombresNivel), 'Restablecer los nombres de nivel');
}

function cargar() {
	// Ruta de cada estante creado → su id, para asignar el stock.
	const estantes = new Map<string, number>();
	for (const pasillo of datos.ubicaciones) {
		const idPasillo = exigir(ubicaciones.crear({ nombre: pasillo.nombre }), `Crear «${pasillo.nombre}»`).id;
		for (const estanteria of pasillo.estanterias) {
			const idEstanteria = exigir(
				ubicaciones.crear({ nombre: estanteria.nombre, padreId: idPasillo }),
				`Crear «${pasillo.nombre} > ${estanteria.nombre}»`
			).id;
			for (const estante of estanteria.estantes) {
				const ruta = `${pasillo.nombre} > ${estanteria.nombre} > ${estante}`;
				const id = exigir(ubicaciones.crear({ nombre: estante, padreId: idEstanteria }), `Crear «${ruta}»`).id;
				estantes.set(ruta, id);
			}
		}
	}

	for (const p of datos.productos) {
		const producto = exigir(
			catalogo.crear({ nombre: p.nombre, marca: p.marca, categoria: p.categoria }),
			`Crear el producto «${p.nombre}»`
		);
		for (const [ruta, cantidad] of p.stock) {
			const idEstante = estantes.get(ruta);
			if (idEstante === undefined) throw new Error(`«${p.nombre}»: el estante «${ruta}» no existe en los datos`);
			exigir(stock.fijarCantidad(producto.id, idEstante, cantidad), `Stock de «${p.nombre}» en «${ruta}»`);
		}
	}

	return { ubicaciones: estantes.size, productos: datos.productos.length };
}

try {
	vaciar();
	const cargado = cargar();
	console.log(
		`Datos de ejemplo cargados: ${datos.ubicaciones.length} pasillos, ${cargado.ubicaciones} estantes, ${cargado.productos} productos.`
	);
} catch (e) {
	console.error(e instanceof Error ? e.message : e);
	process.exitCode = 1;
}
