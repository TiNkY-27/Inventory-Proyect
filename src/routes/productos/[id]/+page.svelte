<script lang="ts">
	import { enhance } from '$app/forms';
	import type { PageProps } from './$types';

	let { data, form }: PageProps = $props();

	const valores = $derived(form?.accion === 'editar' ? form.valores : data.producto);
	const valoresStock = $derived(form?.accion === 'stock' && 'valores' in form ? form.valores : undefined);
</script>

<svelte:head><title>Editar {data.producto.nombre}</title></svelte:head>

<main class="mx-auto max-w-4xl px-4 py-6">
	<p class="mb-4 text-sm"><a href="/productos" class="text-blue-700 hover:underline">← Productos</a></p>

	<h1 class="mb-6 text-2xl font-semibold">Editar producto</h1>

	<form method="POST" action="?/editar" use:enhance class="grid max-w-md gap-3">
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
		{#if form?.accion === 'editar'}
			<p class="text-sm text-red-700">{form.error}</p>
		{/if}
		<div class="flex gap-3">
			<button class="rounded bg-blue-600 px-3 py-1.5 text-white hover:bg-blue-700">Guardar</button>
			<a href="/productos" class="px-3 py-1.5 text-gray-700 hover:underline">Cancelar</a>
		</div>
	</form>

	<section class="mt-10">
		<h2 class="mb-3 text-lg font-medium">Stock</h2>

		{#if data.stock.ubicaciones.length === 0}
			<p class="mb-4 text-gray-600">Sin stock.</p>
		{:else}
			<table class="mb-4 w-full max-w-xl text-left text-sm">
				<thead class="border-b border-gray-300">
					<tr>
						<th class="py-2 pr-4 font-medium">{data.nombreEstante}</th>
						<th class="py-2 text-right font-medium">Cantidad</th>
					</tr>
				</thead>
				<tbody>
					{#each data.stock.ubicaciones as u (u.ubicacionId)}
						<tr class="border-b border-gray-100">
							<td class="py-2 pr-4">{u.ruta}</td>
							<td class="py-2 text-right tabular-nums">{u.cantidad}</td>
						</tr>
					{/each}
				</tbody>
				<tfoot>
					<tr>
						<td class="py-2 pr-4 font-medium">Total</td>
						<td class="py-2 text-right font-medium tabular-nums">{data.stock.total}</td>
					</tr>
				</tfoot>
			</table>
		{/if}

		{#if data.estantes.length === 0}
			<p class="text-sm text-gray-600">
				Para asignar stock, primero creá ubicaciones en
				<a href="/ubicaciones" class="text-blue-700 hover:underline">Ubicaciones</a>.
			</p>
		{:else}
			<form method="POST" action="?/stock" use:enhance class="flex flex-wrap items-end gap-3">
				<label class="flex flex-col gap-1 text-sm">
					{data.nombreEstante}
					<select name="ubicacionId" class="rounded border border-gray-300 px-2 py-1">
						<option value="" selected={!valoresStock?.ubicacionId}>Elegí…</option>
						{#each data.estantes as e (e.id)}
							<option value={e.id} selected={valoresStock?.ubicacionId === String(e.id)}>{e.ruta}</option>
						{/each}
					</select>
				</label>
				<label class="flex flex-col gap-1 text-sm">
					Cantidad
					<input
						name="cantidad"
						type="number"
						min="0"
						step="1"
						value={valoresStock?.cantidad ?? ''}
						class="w-28 rounded border border-gray-300 px-2 py-1"
					/>
				</label>
				<button class="rounded bg-blue-600 px-3 py-1.5 text-white hover:bg-blue-700">Guardar</button>
			</form>
			<p class="mt-1 text-xs text-gray-500">Fija la cantidad en ese lugar. Con 0 se quita de la lista.</p>
			{#if form?.accion === 'stock' && 'error' in form}
				<p class="mt-2 text-sm text-red-700">{form.error}</p>
			{/if}
		{/if}
	</section>
</main>
