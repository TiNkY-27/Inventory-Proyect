import { fail } from '@sveltejs/kit';
import * as ubicaciones from '$lib/server/ubicaciones';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = () => {
	return {
		arbol: ubicaciones.listarArbol(),
		nombresNivel: ubicaciones.obtenerNombresNivel()
	};
};

// Cada error se muestra junto al formulario que lo produjo: "objetivo" identifica ese lugar.
export const actions: Actions = {
	crear: async ({ request }) => {
		const form = await request.formData();
		const padre = String(form.get('padreId') ?? '');
		const padreId = padre ? Number(padre) : null;
		const objetivo = padreId === null ? 'raiz' : `agregar-${padreId}`;
		const resultado = ubicaciones.crear({ nombre: String(form.get('nombre') ?? ''), padreId });
		if (!resultado.ok) return fail(400, { objetivo, error: resultado.error });
		return { objetivo };
	},
	renombrar: async ({ request }) => {
		const form = await request.formData();
		const id = Number(form.get('id'));
		const resultado = ubicaciones.renombrar(id, String(form.get('nombre') ?? ''));
		if (!resultado.ok) return fail(400, { objetivo: `nodo-${id}`, error: resultado.error });
		return { objetivo: `nodo-${id}` };
	},
	eliminar: async ({ request }) => {
		const form = await request.formData();
		const id = Number(form.get('id'));
		const resultado = ubicaciones.eliminar(id);
		if (!resultado.ok) return fail(409, { objetivo: `nodo-${id}`, error: resultado.error });
		return { objetivo: `nodo-${id}` };
	},
	nombresNivel: async ({ request }) => {
		const form = await request.formData();
		const nombres = [1, 2, 3].map((n) => String(form.get(`nivel${n}`) ?? '')) as [string, string, string];
		const resultado = ubicaciones.cambiarNombresNivel(nombres);
		if (!resultado.ok) return fail(400, { objetivo: 'niveles', error: resultado.error });
		return { objetivo: 'niveles', guardado: true };
	}
};
