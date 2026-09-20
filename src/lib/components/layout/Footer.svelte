<script lang="ts">
	import { GITHUB_URL_VERT } from "$lib/util/consts";
	import { m } from "$lib/paraglide/messages";

	const commitHash =
		__COMMIT_HASH__ && __COMMIT_HASH__ !== "unknown"
			? __COMMIT_HASH__
			: null;
</script>

<!-- Status bar, like the one the access gate and the management panel carry:
     the system on the left, what this instance is on the right. -->
<footer class="w-full border-t border-separator">
	<div
		class="w-full max-w-[100rem] mx-auto px-5 py-5 flex flex-wrap items-center justify-between gap-x-6 gap-y-2"
	>
		<p class="brand-small">
			<span class="dot dot-small" aria-hidden="true"></span>
			m4rv1n
		</p>
		<div class="flex flex-wrap items-center gap-x-5 gap-y-2 meta">
			<a class="hover:text-accent" href={GITHUB_URL_VERT} target="_blank"
				>{m["footer.source_code"]()}</a
			>
			<a class="hover:text-accent" href="/privacy/"
				>{m["footer.privacy_policy"]()}</a
			>
			{#if commitHash}
				<a
					class="hover:text-accent"
					href="{GITHUB_URL_VERT}/commit/{commitHash}"
					target="_blank">{commitHash}</a
				>
			{/if}
			<p>INTEGRA file converter</p>
		</div>
	</div>
</footer>
