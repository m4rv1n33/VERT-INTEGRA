<script lang="ts">
	import { duration, fade } from "$lib/util/animation";
	import { dropping } from "$lib/store/index.svelte";
	import { quintOut } from "svelte/easing";
</script>

{#if $dropping}
	<!-- One accent outline over the page while a file is held over it. -->
	<div
		class="fixed inset-0 z-[100] pointer-events-none"
		style="border: 2px solid var(--accent); background: rgb(235 0 0 / 0.06);"
		transition:fade={{
			duration,
			easing: quintOut,
		}}
	></div>
{/if}
