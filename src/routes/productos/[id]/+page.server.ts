import { error, fail, redirect } from '@sveltejs/kit';
import * as catalogo from '$lib/server/catalogo';
import * as stock from '$lib/server/stock';
import * as ubicaciones from '$lib/server/ubicaciones';
import type { Actions, PageServerLoad } from './$types';

function obtenerId(param: string): number {
	const id = Number(param);
	if (!Number.isInteger(id) || id <= 0) error(404, 'Producto no encontrado');
	return id;
}

export const load: PageServerLoad = ({ params }) => {
	const producto = catalogo.obtenerPorId(obtenerId(params.id));
	if (!producto) error(404, 'Producto no encontrado');
	return {
		producto,
		stock: stock.obtenerStockDeProducto(producto.id),
		estantes: ubicaciones.listarNivel3(),
		nombreEstante: ubicaciones.obtenerNombresNivel()[2]
	};
};

export const actions: Actions = {
	editar: async ({ params, request }) => {
		const form = await request.formData();
		const valores = {
			nombre: String(form.get('nombre') ?? ''),
			marca: String(form.get('marca') ?? ''),
			categoria: String(form.get('categoria') ?? '')
		};
		const resultado = catalogo.editar(obtenerId(params.id), valores);
		if (!resultado.ok) return fail(400, { accion: 'editar' as const, error: resultado.error, valores });
		redirect(303, '/productos');
	},
	stock: async ({ params, request }) => {
		const form = await request.formData();
		const valores = {
			ubicacionId: String(form.get('ubicacionId') ?? ''),
			cantidad: String(form.get('cantidad') ?? '')
		};
		if (!valores.ubicacionId) {
			return fail(400, { accion: 'stock' as const, error: 'Elegí una ubicación.', valores });
		}
		if (!valores.cantidad.trim()) {
			return fail(400, { accion: 'stock' as const, error: 'Indicá una cantidad.', valores });
		}
		const resultado = stock.fijarCantidad(
			obtenerId(params.id),
			Number(valores.ubicacionId),
			Number(valores.cantidad)
		);
		if (!resultado.ok) return fail(400, { accion: 'stock' as const, error: resultado.error, valores });
		return { accion: 'stock' as const };
	}
};
