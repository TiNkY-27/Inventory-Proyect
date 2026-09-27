<script lang="ts">
	import { enhance } from '$app/forms';
	import type { SubmitFunction } from '@sveltejs/kit';
	import type { NodoUbicacion } from '$lib/server/ubicaciones';
	import type { PageProps } from './$types';

	let { data, form }: PageProps = $props();

	const nombres = $derived(data.nombresNivel);

	// Con JavaScript, cierra el desplegable del formulario cuando la acción sale bien.
	const cerrarAlTerminar: SubmitFunction = ({ formElement }) => {
		return async ({ result, update }) => {
			await update();
			if (result.type === 'success') formElement.closest('details')?.removeAttribute('open');
		};
	};

	function error(objetivo: string): string | undefined {
		return form?.objetivo === objetivo && 'error' in form ? form.error : undefined;
	}
</script>

<svelte:head><title>Ubicaciones</title></svelte:head>

{#snippet mensajeError(texto: string | undefined)}
	{#if texto}
		<p class="mt-1 text-sm text-red-700">{texto}</p>
	{/if}
{/snippet}

{#snippet nodo(u: NodoUbicacion)}
	<li class="py-1">
		<div class="flex flex-wrap items-baseline gap-x-3 gap-y-1">
			<span class="text-xs tracking-wide text-gray-500 uppercase">{nombres[u.nivel - 1]}</span>
			<span class="font-medium">{u.nombre}</span>
			<details class="text-sm">
				<summary class="cursor-pointer text-blue-700">Renombrar</summary>
				<form method="POST" action="?/renombrar" use:enhance={cerrarAlTerminar} class="mt-1 flex gap-2">
					<input type="hidden" name="id" value={u.id} />
					<input name="nombre" value={u.nombre} class="rounded border border-gray-300 px-2 py-0.5" />
					<button class="rounded bg-blue-600 px-2 py-0.5 text-white hover:bg-blue-700">Guardar</button>
				</form>
			</details>
			<form
				method="POST"
				action="?/eliminar"
				use:enhance
				class="text-sm"
				onsubmit={(e) => {
					if (!confirm(`¿Eliminar «${u.nombre}»?`)) e.preventDefault();
				}}
			>
				<input type="hidden" name="id" value={u.id} />
				<button class="text-red-700 hover:underline">Eliminar</button>
			</form>
		</div>
		{@render mensajeError(error(`nodo-${u.id}`))}

		{#if u.nivel < nombres.length}
			<ul class="ml-2 border-l border-gray-200 pl-4">
				{#each u.hijas as hija (hija.id)}
					{@render nodo(hija)}
				{/each}
				<li class="py-1 text-sm">
					<details>
						<summary class="cursor-pointer text-blue-700">Agregar {nombres[u.nivel]}</summary>
						<form method="POST" action="?/crear" use:enhance={cerrarAlTerminar} class="mt-1 flex gap-2">
							<input type="hidden" name="padreId" value={u.id} />
							<input
								name="nombre"
								placeholder="Nombre"
								class="rounded border border-gray-300 px-2 py-0.5"
							/>
							<button class="rounded bg-blue-600 px-2 py-0.5 text-white hover:bg-blue-700">Agregar</button>
						</form>
					</details>
					{@render mensajeError(error(`agregar-${u.id}`))}
				</li>
			</ul>
		{:else}
			{@render mensajeError(error(`agregar-${u.id}`))}
		{/if}
	</li>
{/snippet}

<main class="mx-auto max-w-4xl px-4 py-6">
	<h1 class="mb-6 text-2xl font-semibold">Ubicaciones</h1>

	<section class="mb-8 rounded border border-gray-200 p-4">
		<h2 class="mb-3 text-lg font-medium">Nuevo {nombres[0]}</h2>
		<form method="POST" action="?/crear" use:enhance class="flex gap-3">
			<input name="nombre" placeholder="Nombre" class="rounded border border-gray-300 px-2 py-1" />
			<button class="rounded bg-blue-600 px-3 py-1.5 text-white hover:bg-blue-700">Agregar</button>
		</form>
		{@render mensajeError(error('raiz'))}
	</section>

	{#if data.arbol.length === 0}
		<p class="mb-8 text-gray-600">Todavía no hay ubicaciones.</p>
	{:else}
		<ul class="mb-8">
			{#each data.arbol as u (u.id)}
				{@render nodo(u)}
			{/each}
		</ul>
	{/if}

	<section class="rounded border border-gray-200 p-4">
		<h2 class="mb-1 text-lg font-medium">Nombres de los niveles</h2>
		<p class="mb-3 text-sm text-gray-600">Cómo se llama cada nivel en tu negocio.</p>
		<form method="POST" action="?/nombresNivel" use:enhance class="grid gap-3 sm:grid-cols-4 sm:items-end">
			{#each nombres as nombre, i (i)}
				<label class="flex flex-col gap-1 text-sm">
					Nivel {i + 1}
					<input name="nivel{i + 1}" value={nombre} class="rounded border border-gray-300 px-2 py-1" />
				</label>
			{/each}
			<button class="rounded bg-blue-600 px-3 py-1.5 text-white hover:bg-blue-700">Guardar</button>
		</form>
		{@render mensajeError(error('niveles'))}
		{#if form?.objetivo === 'niveles' && 'guardado' in form}
			<p class="mt-1 text-sm text-green-700">Nombres guardados.</p>
		{/if}
	</section>
</main>
