import * as catalogo from '$lib/server/catalogo';
import * as stock from '$lib/server/stock';
import type { PageServerLoad } from './$types';

// La página combina los bloques: Catálogo busca y Stock trae las cantidades de todos los resultados juntos.
export const load: PageServerLoad = ({ url }) => {
	const q = url.searchParams.get('q')?.trim() ?? '';
	if (!q) return { q, resultados: null };

	const productos = catalogo.buscar(q);
	const stockPorProducto = stock.obtenerStockDeProductos(productos.map((p) => p.id));
	return {
		q,
		resultados: productos.map((producto) => ({
			...producto,
			stock: stockPorProducto.get(producto.id)!
		}))
	};
};
