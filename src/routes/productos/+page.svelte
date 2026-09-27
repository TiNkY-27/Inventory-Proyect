<script lang="ts">
	import { enhance } from '$app/forms';
	import type { PageProps } from './$types';

	let { data, form }: PageProps = $props();

	const valores = $derived(form?.accion === 'crear' && 'valores' in form ? form.valores : undefined);
</script>

<svelte:head><title>Productos</title></svelte:head>

<main class="mx-auto max-w-4xl px-4 py-6">
	<h1 class="mb-6 text-2xl font-semibold">Productos</h1>

	<section class="mb-8 rounded border border-gray-200 p-4">
		<h2 class="mb-3 text-lg font-medium">Nuevo producto</h2>
		<form method="POST" action="?/crear" use:enhance class="grid gap-3 sm:grid-cols-4 sm:items-end">
			<label class="flex flex-col gap-1 text-sm">
				Nombre
				<input name="nombre" value={valores?.nombre ?? ''} class="rounded border border-gray-300 px-2 py-1" />
			</label>
			<label class="flex flex-col gap-1 text-sm">
				Marca
				<input name="marca" value={valores?.marca ?? ''} class="rounded border border-gray-300 px-2 py-1" />
			</label>
			<label class="flex flex-col gap-1 text-sm">
				Categoría
				<input
					name="categoria"
					value={valores?.categoria ?? ''}
					class="rounded border border-gray-300 px-2 py-1"
				/>
			</label>
			<button class="rounded bg-blue-600 px-3 py-1.5 text-white hover:bg-blue-700">Agregar</button>
		</form>
		{#if form?.accion === 'crear' && 'error' in form}
			<p class="mt-3 text-sm text-red-700">{form.error}</p>
		{:else if form?.accion === 'crear' && 'creado' in form}
			<p class="mt-3 text-sm text-green-700">Se agregó «{form.creado}».</p>
		{/if}
	</section>

	{#if form?.accion === 'eliminar' && 'error' in form}
		<p class="mb-4 rounded bg-red-50 px-3 py-2 text-sm text-red-700">{form.error}</p>
	{/if}

	{#if data.productos.length === 0}
		<p class="text-gray-600">Todavía no hay productos.</p>
	{:else}
		<table class="w-full text-left text-sm">
			<thead class="border-b border-gray-300">
				<tr>
					<th class="py-2 pr-4 font-medium">Nombre</th>
					<th class="py-2 pr-4 font-medium">Marca</th>
					<th class="py-2 pr-4 font-medium">Categoría</th>
					<th class="py-2"></th>
				</tr>
			</thead>
			<tbody>
				{#each data.productos as producto (producto.id)}
					<tr class="border-b border-gray-100">
						<td class="py-2 pr-4">{producto.nombre}</td>
						<td class="py-2 pr-4">{producto.marca ?? '—'}</td>
						<td class="py-2 pr-4">{producto.categoria ?? '—'}</td>
						<td class="py-2 text-right whitespace-nowrap">
							<a href="/productos/{producto.id}" class="text-blue-700 hover:underline">Editar</a>
							<form
								method="POST"
								action="?/eliminar"
								use:enhance
								class="ml-3 inline"
								onsubmit={(e) => {
									if (!confirm(`¿Eliminar «${producto.nombre}»?`)) e.preventDefault();
								}}
							>
								<input type="hidden" name="id" value={producto.id} />
								<button class="text-red-700 hover:underline">Eliminar</button>
							</form>
						</td>
					</tr>
				{/each}
			</tbody>
		</table>
	{/if}
</main>
