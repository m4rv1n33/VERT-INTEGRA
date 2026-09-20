<script lang="ts">
	import type { Snippet } from "svelte";

	type Props = {
		class?: string;
		children: Snippet<[]>;
	};

	const { class: classList, children }: Props = $props();
</script>

<!-- A surface in the INTEGRA look: hairline border, small radius, no shadow. -->
<div class="bg-panel border border-separator rounded-lg p-5 {classList}">
	{@render children?.()}
</div>
