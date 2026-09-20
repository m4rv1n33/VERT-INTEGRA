<script lang="ts">
	import ConversionPanel from "$lib/components/functional/ConversionPanel.svelte";
	import FormatDropdown from "$lib/components/functional/FormatDropdown.svelte";
	import Uploader from "$lib/components/functional/Uploader.svelte";
	import Panel from "$lib/components/visual/Panel.svelte";
	import ProgressBar from "$lib/components/visual/ProgressBar.svelte";
	import Tooltip from "$lib/components/visual/Tooltip.svelte";
	import { categories, converters } from "$lib/converters";
	import {
		files,
		vertdLoaded,
		dropdownStates,
	} from "$lib/store/index.svelte";
	import { VertFile } from "$lib/types";
	import {
		AudioLines,
		BookText,
		DownloadIcon,
		FileMusicIcon,
		FileQuestionIcon,
		FileVideo2,
		FilmIcon,
		ImageIcon,
		ImageOffIcon,
		RotateCwIcon,
		XIcon,
	} from "lucide-svelte";
	import { m } from "$lib/paraglide/messages";
	import { Settings } from "$lib/sections/settings/index.svelte";
	import { MAX_ARRAY_BUFFER_SIZE } from "$lib/store/index.svelte";
	import { GB } from "$lib/util/consts";
	import { log } from "$lib/util/logger";

	let processedFileIds = $state(new Set<string>());

	$effect(() => {
		if (!Settings.instance.settings || files.files.length === 0) return;

		files.files.forEach((file) => {
			const settings = Settings.instance.settings;
			if (processedFileIds.has(file.id)) return;

			const converter = file.findConverter();
			if (!converter) return;

			let category: string | undefined;
			const isImage = converter.name === "imagemagick";
			const isAudio = converter.name === "ffmpeg";
			const isVideo = converter.name === "vertd";
			const isDocument = converter.name === "pandoc";

			if (isImage) category = "image";
			else if (isAudio) category = "audio";
			else if (isVideo) category = "video";
			else if (isDocument) category = "doc";
			if (!category) return;

			let targetFormat: string | undefined;

			// restore saved format (if navigated back to page for example)
			const savedFormat = $dropdownStates[file.name];
			if (
				savedFormat &&
				savedFormat !== file.from &&
				categories[category]?.formats.includes(savedFormat)
			) {
				targetFormat = savedFormat;
			} else if (settings.useDefaultFormat) {
				// else use default format if enabled
				let defaultFormat: string | undefined;
				const df = settings.defaultFormat;
				if (category === "image") defaultFormat = df.image;
				else if (category === "audio") defaultFormat = df.audio;
				else if (category === "video") defaultFormat = df.video;
				else if (category === "doc") defaultFormat = df.document;

				if (
					defaultFormat &&
					defaultFormat !== file.from &&
					categories[category]?.formats.includes(defaultFormat)
				) {
					targetFormat = defaultFormat;
				}
			}

			// or use first available format (or if default format is same as input)
			if (!targetFormat) {
				const firstDiff = categories[category]?.formats.find(
					(f) => f !== file.from,
				);
				targetFormat =
					firstDiff || categories[category]?.formats[0] || "";
			}

			file.to = targetFormat;
			processedFileIds.add(file.id);
		});
	});

	const handleSelect = (option: string, file: VertFile) => {
		file.result = null;
	};
</script>

{#snippet fileItem(file: VertFile, index: number)}
	{@const currentConverter = file.findConverter()}
	{@const isImage = currentConverter?.name === "imagemagick"}
	{@const isAudio = currentConverter?.name === "ffmpeg"}
	{@const isVideo = currentConverter?.name === "vertd"}
	{@const isDocument = currentConverter?.name === "pandoc"}
	<Panel class="flex flex-col min-w-0 gap-4 relative">
		<div class="flex-shrink-0 h-8 w-full flex items-center gap-2">
			{#if !converters.length}
				<Tooltip
					text={m["convert.tooltips.unknown_file"]()}
					position="bottom"
				>
					<FileQuestionIcon size="24" class="flex-shrink-0" />
				</Tooltip>
			{:else if isAudio}
				<Tooltip
					text={m["convert.tooltips.audio_file"]()}
					position="bottom"
				>
					<AudioLines size="24" class="flex-shrink-0" />
				</Tooltip>
			{:else if isVideo}
				<Tooltip
					text={m["convert.tooltips.video_file"]()}
					position="bottom"
				>
					<FilmIcon size="24" class="flex-shrink-0" />
				</Tooltip>
			{:else if isDocument}
				<Tooltip
					text={m["convert.tooltips.document_file"]()}
					position="bottom"
				>
					<BookText size="24" class="flex-shrink-0" />
				</Tooltip>
			{:else}
				<Tooltip
					text={m["convert.tooltips.image_file"]()}
					position="bottom"
				>
					<ImageIcon size="24" class="flex-shrink-0" />
				</Tooltip>
			{/if}
			<div class="flex-grow overflow-hidden">
				{#if file.processing}
					<ProgressBar
						min={0}
						max={100}
						progress={currentConverter?.reportsProgress ||
						file.isZip()
							? file.progress
							: null}
					/>
				{:else}
					<h2
						class="text-base overflow-hidden text-ellipsis whitespace-nowrap"
						title={file.name}
					>
						{file.name}
					</h2>
				{/if}
			</div>
			<button
				class="flex-shrink-0 w-8 rounded-md hover:bg-hover h-full flex items-center justify-center"
				onclick={async () => {
					await file.cancel();
					files.files = files.files.filter((_, i) => i !== index);
				}}
			>
				<XIcon size="24" class="text-muted" />
			</button>
		</div>
		{#if !currentConverter}
			{#if file.name.startsWith("vertd")}
				<div
					class="h-full flex flex-col text-center justify-center text-failure"
				>
					<p class="font-body font-bold">
						{m["convert.errors.cant_convert"]()}
					</p>
					<p class="font-normal">
						{m["convert.errors.vertd_server"]()}
					</p>
				</div>
			{:else}
				<div
					class="h-full flex flex-col text-center justify-center text-failure"
				>
					<p class="font-body font-bold">
						{m["convert.errors.cant_convert"]()}
					</p>
					<p class="font-normal">
						{m["convert.errors.unsupported_format"]()}
					</p>
				</div>
			{/if}
		{:else}
			{@const formatInfo = currentConverter.supportedFormats.find(
				(f) => f.name === file.from,
			)}
			{@const isLarge = file.isLarge()}
			{#if formatInfo && !formatInfo.fromSupported}
				<div
					class="h-full flex flex-col text-center justify-center text-failure"
				>
					<p class="font-body font-bold">
						{m["convert.errors.cant_convert"]()}
					</p>
					<p class="font-normal">
						{m["convert.errors.format_output_only"]()}
					</p>
				</div>
			{:else if isLarge && !file.supportsStreaming()}
				<div
					class="h-full flex flex-col text-center justify-center text-failure"
				>
					<p class="font-body font-bold">
						{m["convert.errors.cant_convert"]()}
					</p>
					<p class="font-normal">
						{m["workers.errors.file_too_large"]({
							limit: (MAX_ARRAY_BUFFER_SIZE / GB).toFixed(2),
						})}
					</p>
				</div>
			{:else if currentConverter.status === "downloading"}
				<div
					class="h-full flex flex-col text-center justify-center text-failure"
				>
					<p class="font-body font-bold">
						{m["convert.errors.cant_convert"]()}
					</p>
					<p class="font-normal">
						{m["convert.errors.worker_downloading"]({
							type: isAudio
								? m["convert.errors.audio"]()
								: isVideo
									? "Video"
									: isDocument
										? m["convert.errors.doc"]()
										: m["convert.errors.image"](),
						})}
					</p>
				</div>
			{:else if currentConverter.status === "error"}
				<div
					class="h-full flex flex-col text-center justify-center text-failure"
				>
					<p class="font-body font-bold">
						{m["convert.errors.cant_convert"]()}
					</p>
					<p class="font-normal">
						{m["convert.errors.worker_error"]({
							type: isAudio
								? m["convert.errors.audio"]()
								: isVideo
									? "Video"
									: isDocument
										? m["convert.errors.doc"]()
										: m["convert.errors.image"](),
						})}
					</p>
				</div>
			{:else if currentConverter.status === "not-ready"}
				<div
					class="h-full flex flex-col text-center justify-center text-failure"
				>
					<p class="font-body font-bold">
						{m["convert.errors.cant_convert"]()}
					</p>
					<p class="font-normal">
						{m["convert.errors.worker_timeout"]({
							type: isAudio
								? m["convert.errors.audio"]()
								: isVideo
									? "Video"
									: isDocument
										? m["convert.errors.doc"]()
										: m["convert.errors.image"](),
						})}
					</p>
				</div>
			{:else if isVideo && !$vertdLoaded && !isAudio && !isImage && !isDocument}
				<div
					class="h-full flex flex-col text-center justify-center text-failure"
				>
					<p class="font-body font-bold">
						{m["convert.errors.cant_convert"]()}
					</p>
					<p class="font-normal">
						{m["convert.errors.vertd_not_found"]()}
					</p>
				</div>
			{:else}
				<div class="flex flex-row justify-between">
					<div
						class="flex gap-4 w-full h-[152px] overflow-hidden relative"
					>
						<div
							class="w-1/2 h-full overflow-hidden rounded-md border border-separator"
						>
							{#if file.blobUrl}
								<img
									class="object-cover w-full h-full"
									src={file.blobUrl}
									alt={file.name}
								/>
							{:else}
								<div
									class="w-full h-full flex items-center justify-center bg-panel-highlight text-muted"
								>
									{#if isAudio}
										<FileMusicIcon size="56" />
									{:else if isVideo}
										<FileVideo2 size="56" />
									{:else if isDocument}
										<BookText size="56" />
									{:else}
										<ImageOffIcon size="56" />
									{/if}
								</div>
							{/if}
						</div>
					</div>
					<div
						class="absolute top-16 right-0 mr-4 pl-2 h-[calc(100%-83px)] w-[calc(50%-38px)] pr-4 pb-1 flex items-center justify-center aspect-square"
					>
						<div
							class="w-[122px] h-fit flex flex-col gap-2 items-center justify-center"
						>
							<FormatDropdown
								{categories}
								from={file.from}
								bind:selected={file.to}
								onselect={(option) =>
									handleSelect(option, file)}
								{file}
							/>
							<div
								class="w-full flex items-center justify-between"
							>
								<Tooltip
									text={m["convert.tooltips.convert_file"]()}
									position="bottom"
								>
									<button
										class="btn highlight p-0 w-12 h-12"
										disabled={!files.ready}
										onclick={() => file.convert()}
									>
										<RotateCwIcon size="20" />
									</button>
								</Tooltip>
								<Tooltip
									text={m["convert.tooltips.download_file"]()}
									position="bottom"
								>
									<button
										class="btn p-0 w-12 h-12"
										onclick={file.download}
										disabled={!file.result}
									>
										<DownloadIcon size="20" />
									</button>
								</Tooltip>
							</div>
						</div>
					</div>
				</div>
			{/if}
		{/if}
	</Panel>
{/snippet}

<div class="flex flex-col gap-8">
	<h1 class="text-3xl md:text-4xl">{m["convert.page.title"]()}</h1>

	<section class="flex flex-col gap-3">
		<div class="flex flex-wrap items-baseline justify-between gap-x-4">
			<p class="eyebrow">
				<span class="text-accent">01</span> / {m[
					"convert.page.batch"
				]()}
			</p>
			<p class="meta">
				{m["convert.page.queued"]({ count: files.files.length })}
			</p>
		</div>
		<ConversionPanel />
	</section>

	<section class="flex flex-col gap-3">
		<p class="eyebrow">
			<span class="text-accent">02</span> / {m["convert.page.files"]()}
		</p>
		<div
			class="w-full grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 auto-rows-[240px] gap-4"
		>
			{#each files.files as file, i (file.id)}
				{@render fileItem(file, i)}
			{/each}
			<Uploader class="w-full h-full" />
		</div>
	</section>
</div>
