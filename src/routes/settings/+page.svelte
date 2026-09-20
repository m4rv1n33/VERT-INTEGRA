<script lang="ts">
	import { browser } from "$app/environment";
	import { log } from "$lib/util/logger";
	import * as Settings from "$lib/sections/settings/index.svelte";
	import { PUB_PLAUSIBLE_URL } from "$env/static/public";
	import { onMount } from "svelte";
	import { m } from "$lib/paraglide/messages";
	import { ToastManager } from "$lib/util/toast.svelte";
	import { DISABLE_ALL_EXTERNAL_REQUESTS } from "$lib/util/consts";

	let settings = $state(Settings.Settings.instance.settings);

	let isInitial = $state(true);

	$effect(() => {
		if (!browser) return;
		if (isInitial) {
			isInitial = false;
			return;
		}

		const savedSettings = localStorage.getItem("settings");
		if (savedSettings) {
			const parsedSettings = JSON.parse(savedSettings);
			if (JSON.stringify(parsedSettings) === JSON.stringify(settings))
				return;
		}

		try {
			Settings.Settings.instance.settings = settings;
			Settings.Settings.instance.save();
			log(["settings"], "saving settings");
		} catch (error) {
			log(["settings", "error"], `failed to save settings: ${error}`);
			ToastManager.add({
				type: "error",
				message: m["settings.errors.save_failed"](),
			});
		}
	});

	onMount(() => {
		const savedSettings = localStorage.getItem("settings");
		if (savedSettings) {
			const parsedSettings = JSON.parse(savedSettings);
			Settings.Settings.instance.settings = {
				...Settings.Settings.instance.settings,
				...parsedSettings,
			};
			settings = Settings.Settings.instance.settings;
		}
	});
</script>

<div class="flex flex-col gap-8">
	<h1 class="text-3xl md:text-4xl">{m["settings.title"]()}</h1>

	<div class="w-full flex flex-col md:flex-row gap-4">
		<div class="flex flex-col gap-4 flex-1">
			<Settings.Conversion bind:settings />
			{#if !DISABLE_ALL_EXTERNAL_REQUESTS}
				<Settings.Vertd bind:settings />
			{:else if PUB_PLAUSIBLE_URL}
				<Settings.Privacy bind:settings />
			{/if}
		</div>

		<div class="flex flex-col gap-4 flex-1">
			<Settings.Appearance />
			{#if PUB_PLAUSIBLE_URL && !DISABLE_ALL_EXTERNAL_REQUESTS}
				<Settings.Privacy bind:settings />
			{/if}
		</div>
	</div>
</div>
