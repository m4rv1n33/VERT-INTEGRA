<script lang="ts">
	import Panel from "$lib/components/visual/Panel.svelte";
	import {
		effects,
		setEffects,
		updateLocale,
		availableLocales,
	} from "$lib/store/index.svelte";
	import { PaletteIcon, PauseIcon, PlayIcon } from "lucide-svelte";
	import { onMount, onDestroy } from "svelte";
	import { m } from "$lib/paraglide/messages";
	import { getLocale } from "$lib/paraglide/runtime";
	import Dropdown from "$lib/components/functional/Dropdown.svelte";

	let currentLocale = $state("en");

	const getLanguageDisplayName = (locale: string) => {
		try {
			return availableLocales[locale as keyof typeof availableLocales];
		} catch {
			return locale.toUpperCase();
		}
	};

	const languageOptions = Object.keys(availableLocales).map((locale) =>
		getLanguageDisplayName(locale),
	);

	let enableEffectsElement: HTMLButtonElement;
	let disableEffectsElement: HTMLButtonElement;

	let effectsUnsubscribe: () => void;

	const updateEffectsClasses = (value: boolean) => {
		if (value) {
			enableEffectsElement.classList.add("selected");
			disableEffectsElement.classList.remove("selected");
		} else {
			disableEffectsElement.classList.add("selected");
			enableEffectsElement.classList.remove("selected");
		}
	};

	onMount(() => {
		effectsUnsubscribe = effects.subscribe(updateEffectsClasses);

		currentLocale = localStorage.getItem("locale") || getLocale();
	});

	onDestroy(() => {
		if (effectsUnsubscribe) effectsUnsubscribe();
	});

	$effect(() => {
		updateEffectsClasses($effects);
	});

	function handleLanguageChange(selectedLanguage: string) {
		const selectedLocale = Object.keys(availableLocales).find(
			(locale) => getLanguageDisplayName(locale) === selectedLanguage,
		);

		if (selectedLocale && selectedLocale !== currentLocale) {
			currentLocale = selectedLocale;
			updateLocale(selectedLocale);
		}
	}
</script>

<Panel class="flex flex-col gap-8">
	<div class="flex flex-col gap-3">
		<h2 class="text-xl font-bold">
			<PaletteIcon
				size="40"
				class="inline-block -mt-1 mr-2 bg-panel-highlight p-2 rounded-md"
				color="var(--accent)"
			/>
			{m["settings.appearance.title"]()}
		</h2>
		<div class="flex flex-col gap-8">
			<div class="flex flex-col gap-4">
				<div class="flex flex-col gap-2">
					<p class="text-base font-bold">
						{m["settings.appearance.effect_settings"]()}
					</p>
					<p class="text-sm text-muted font-normal italic">
						{m["settings.appearance.effect_description"]()}
					</p>
				</div>
				<div class="flex flex-col gap-3 w-full">
					<div class="flex gap-3 w-full">
						<button
							bind:this={enableEffectsElement}
							onclick={() => setEffects(true)}
							class="btn flex-1 p-4 flex items-center justify-center"
						>
							<PlayIcon size="24" class="inline-block mr-2" />
							{m["settings.appearance.enable"]()}
						</button>

						<button
							bind:this={disableEffectsElement}
							onclick={() => setEffects(false)}
							class="btn flex-1 p-4 flex items-center justify-center"
						>
							<PauseIcon size="24" class="inline-block mr-2" />
							{m["settings.appearance.disable"]()}
						</button>
					</div>
				</div>
			</div>
			<div class="flex flex-col gap-4">
				<div class="flex flex-col gap-2">
					<p class="text-base font-bold">
						{m["settings.language.title"]()}
						{#if currentLocale !== "en"} (Language){/if}
					</p>
					<p class="text-sm text-muted font-normal italic">
						{m["settings.language.description"]()}
					</p>
				</div>
				<div class="flex flex-col gap-3 w-full">
					<Dropdown
						options={languageOptions}
						settingsStyle
						selected={getLanguageDisplayName(currentLocale)}
						onselect={handleLanguageChange}
					/>
				</div>
			</div>
		</div>
	</div>
</Panel>
