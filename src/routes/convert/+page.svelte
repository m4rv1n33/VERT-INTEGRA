<script lang="ts">
	import { onMount } from "svelte";
	import { goto } from "$app/navigation";

	// The converter moved to the root, so /convert/ only forwards the old link.
	onMount(() => {
		goto("/", { replaceState: true });
	});
</script>

<svelte:head>
	<title>Convert</title>
	<meta http-equiv="refresh" content="0; url=/" />
	<meta name="robots" content="noindex, nofollow" />
</svelte:head>

<p class="eyebrow">Redirecting to <a class="text-accent" href="/">/</a></p>
