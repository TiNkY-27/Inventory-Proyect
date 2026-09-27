<script lang="ts">
	import './layout.css';
	import favicon from '$lib/assets/favicon.svg';

	let { children } = $props();
</script>

<svelte:head><link rel="icon" href={favicon} /></svelte:head>

<nav class="border-b border-gray-200 bg-gray-50">
	<ul class="mx-auto flex max-w-4xl gap-6 px-4 py-3 text-sm font-medium">
		<li><a href="/" class="hover:underline">Inicio</a></li>
		<li><a href="/productos" class="hover:underline">Productos</a></li>
		<li><a href="/ubicaciones" class="hover:underline">Ubicaciones</a></li>
	</ul>
</nav>
{@render children()}
