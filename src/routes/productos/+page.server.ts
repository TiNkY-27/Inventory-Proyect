import { fail } from '@sveltejs/kit';
import * as catalogo from '$lib/server/catalogo';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = () => {
	return { productos: catalogo.listarTodos() };
};

export const actions: Actions = {
	crear: async ({ request }) => {
		const form = await request.formData();
		const valores = {
			nombre: String(form.get('nombre') ?? ''),
			marca: String(form.get('marca') ?? ''),
			categoria: String(form.get('categoria') ?? '')
		};
		const resultado = catalogo.crear(valores);
		if (!resultado.ok) return fail(400, { accion: 'crear', error: resultado.error, valores });
		return { accion: 'crear', creado: resultado.valor.nombre };
	},
	eliminar: async ({ request }) => {
		const form = await request.formData();
		const resultado = catalogo.eliminar(Number(form.get('id')));
		if (!resultado.ok) return fail(409, { accion: 'eliminar', error: resultado.error });
		return { accion: 'eliminar' };
	}
};
