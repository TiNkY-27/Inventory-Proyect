import { error, fail, redirect } from '@sveltejs/kit';
import * as catalogo from '$lib/server/catalogo';
import type { Actions, PageServerLoad } from './$types';

function obtenerId(param: string): number {
	const id = Number(param);
	if (!Number.isInteger(id) || id <= 0) error(404, 'Producto no encontrado');
	return id;
}

export const load: PageServerLoad = ({ params }) => {
	const producto = catalogo.obtenerPorId(obtenerId(params.id));
	if (!producto) error(404, 'Producto no encontrado');
	return { producto };
};

export const actions: Actions = {
	default: async ({ params, request }) => {
		const form = await request.formData();
		const valores = {
			nombre: String(form.get('nombre') ?? ''),
			marca: String(form.get('marca') ?? ''),
			categoria: String(form.get('categoria') ?? '')
		};
		const resultado = catalogo.editar(obtenerId(params.id), valores);
		if (!resultado.ok) return fail(400, { error: resultado.error, valores });
		redirect(303, '/productos');
	}
};
