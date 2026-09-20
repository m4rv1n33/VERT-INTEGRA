<script lang="ts">
	import { UploadIcon } from "lucide-svelte";
	import clsx from "clsx";
	import { onMount } from "svelte";
	import { files } from "$lib/store/index.svelte";
	import { goto } from "$app/navigation";
	import { m } from "$lib/paraglide/messages";

	type Props = {
		class?: string;
	};

	const { class: classList }: Props = $props();

	let uploaderButton = $state<HTMLButtonElement>();
	let fileInput = $state<HTMLInputElement>();

	const uploadFiles = async () => {
		if (!fileInput) return;
		fileInput.click();
	};

	const handleFileChange = (e: Event) => {
		if (!fileInput) return;
		const oldLength = files.files.length;
		files.add(fileInput.files);
		if (oldLength !== files.files.length) goto("/");
	};

	onMount(() => {
		const handler = (e: Event) => {
			e.preventDefault();
			return false;
		};

		uploaderButton?.addEventListener("dragover", handler);
		uploaderButton?.addEventListener("dragenter", handler);
		uploaderButton?.addEventListener("dragleave", handler);
		uploaderButton?.addEventListener("drop", handler);

		return () => {
			uploaderButton?.removeEventListener("dragover", handler);
			uploaderButton?.removeEventListener("dragenter", handler);
			uploaderButton?.removeEventListener("dragleave", handler);
			uploaderButton?.removeEventListener("drop", handler);
		};
	});
</script>

<input
	bind:this={fileInput}
	type="file"
	multiple
	class="hidden"
	onchange={handleFileChange}
/>

<!-- Drop zone: a dashed hairline field that fills with the accent on hover,
     rather than a filled card. -->
<button
	onclick={uploadFiles}
	bind:this={uploaderButton}
	class={clsx(
		"group flex flex-col items-center justify-center gap-3 rounded-lg border border-dashed border-strong bg-transparent p-6 transition-colors hover:border-accent hover:bg-hover",
		classList,
	)}
>
	<UploadIcon
		size="24"
		class="text-muted transition-colors group-hover:text-accent pointer-events-none"
	/>
	<p class="eyebrow text-center pointer-events-none">
		{m["upload.uploader.text"]({
			action: m["upload.uploader.convert"](),
		})}
	</p>
</button>
