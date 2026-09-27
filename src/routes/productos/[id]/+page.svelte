<script lang="ts">
	import { enhance } from '$app/forms';
	import type { PageProps } from './$types';

	let { data, form }: PageProps = $props();

	const valores = $derived(form?.valores ?? data.producto);
</script>

<svelte:head><title>Editar {data.producto.nombre}</title></svelte:head>

<main class="mx-auto max-w-4xl px-4 py-6">
	<p class="mb-4 text-sm"><a href="/productos" class="text-blue-700 hover:underline">← Productos</a></p>

	<h1 class="mb-6 text-2xl font-semibold">Editar producto</h1>

	<form method="POST" use:enhance class="grid max-w-md gap-3">
		<label class="flex flex-col gap-1 text-sm">
			Nombre
			<input name="nombre" value={valores.nombre} class="rounded border border-gray-300 px-2 py-1" />
		</label>
		<label class="flex flex-col gap-1 text-sm">
			Marca
			<input name="marca" value={valores.marca ?? ''} class="rounded border border-gray-300 px-2 py-1" />
		</label>
		<label class="flex flex-col gap-1 text-sm">
			Categoría
			<input
				name="categoria"
				value={valores.categoria ?? ''}
				class="rounded border border-gray-300 px-2 py-1"
			/>
		</label>
		{#if form?.error}
			<p class="text-sm text-red-700">{form.error}</p>
		{/if}
		<div class="flex gap-3">
			<button class="rounded bg-blue-600 px-3 py-1.5 text-white hover:bg-blue-700">Guardar</button>
			<a href="/productos" class="px-3 py-1.5 text-gray-700 hover:underline">Cancelar</a>
		</div>
	</form>
</main>
