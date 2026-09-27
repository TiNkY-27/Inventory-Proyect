<script lang="ts">
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();
</script>

<svelte:head><title>Inventario</title></svelte:head>

<main class="mx-auto max-w-4xl px-4 py-6">
	<h1 class="mb-6 text-2xl font-semibold">Buscar productos</h1>

	<form method="GET" class="mb-8 flex gap-3">
		<input
			type="search"
			name="q"
			value={data.q}
			placeholder="Nombre, marca o categoría"
			aria-label="Buscar productos"
			class="w-full max-w-md rounded border border-gray-300 px-3 py-2"
		/>
		<button class="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700">Buscar</button>
	</form>

	{#if data.resultados}
		{#if data.resultados.length === 0}
			<p class="text-gray-600">No se encontraron productos para «{data.q}».</p>
		{:else}
			<p class="mb-4 text-sm text-gray-600">
				{data.resultados.length === 1 ? '1 resultado' : `${data.resultados.length} resultados`}
				{#if data.resultados.length === 50}(se muestran los primeros 50; afiná la búsqueda para ver otros){/if}
			</p>
			<ul class="flex flex-col gap-3">
				{#each data.resultados as producto (producto.id)}
					<li class="rounded border border-gray-200 p-4">
						<div class="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
							<a href="/productos/{producto.id}" class="font-medium text-blue-700 hover:underline">
								{producto.nombre}
							</a>
							<span class="text-sm">
								Total: <span class="font-medium tabular-nums">{producto.stock.total}</span>
							</span>
						</div>
						<p class="text-sm text-gray-600">
							{producto.marca ?? 'Sin marca'} · {producto.categoria ?? 'Sin categoría'}
						</p>
						{#if producto.stock.ubicaciones.length === 0}
							<p class="mt-2 text-sm text-gray-500">Sin stock</p>
						{:else}
							<ul class="mt-2 text-sm">
								{#each producto.stock.ubicaciones as u (u.ubicacionId)}
									<li class="flex justify-between gap-4 border-t border-gray-100 py-1">
										<span>{u.ruta}</span>
										<span class="tabular-nums">{u.cantidad}</span>
									</li>
								{/each}
							</ul>
						{/if}
					</li>
				{/each}
			</ul>
		{/if}
	{/if}
</main>
