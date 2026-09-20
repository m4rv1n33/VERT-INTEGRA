<script lang="ts">
	import { page } from "$app/state";
	import { duration } from "$lib/util/animation";
	import { quintOut } from "svelte/easing";
	import { fade } from "$lib/util/animation";

	let { children } = $props();
</script>

<main class="flex-grow w-full max-w-[100rem] mx-auto px-5 py-7 md:py-10">
	<div class="grid grid-rows-1 grid-cols-1 h-full">
		{#key page.url.pathname}
			<div
				class="row-start-1 col-start-1 flex flex-col h-full"
				in:fade={{ duration, easing: quintOut, delay: 50 }}
				out:fade={{ duration, easing: quintOut }}
			>
				{@render children()}
			</div>
		{/key}
	</div>
</main>
