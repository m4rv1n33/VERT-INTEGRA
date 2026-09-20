<script lang="ts">
	import { m } from "$lib/paraglide/messages";
	import { link, sanitize } from "$lib/store/index.svelte";
</script>

<div class="flex flex-col gap-8">
	<div class="flex flex-wrap items-baseline gap-x-4 gap-y-2">
		<h1 class="text-3xl md:text-4xl">{m["privacy.title"]()}</h1>
		<p class="eyebrow"><span class="text-accent">INTEGRA</span> · convert</p>
	</div>

	<div class="w-full flex flex-col md:flex-row gap-4">
		<div
			class="bg-panel border border-separator rounded-lg p-6 font-normal max-w-3xl"
		>
			<h2 class="text-xl mb-3">{m["privacy.summary.title"]()}</h2>
			<p class="mb-4">
				{@html sanitize(
					link(
						["vert_link"],
						m["privacy.summary.description"](),
						["https://vert.sh"],
						[true],
					),
				)}
			</p>

			<h2 class="text-xl mb-3">{m["privacy.conversions.title"]()}</h2>
			<p class="mb-4">
				{@html sanitize(m["privacy.conversions.description"]())}
			</p>

			<h2 class="text-xl mb-3">{m["privacy.donations.title"]()}</h2>
			<p class="mb-4">
				{@html sanitize(
					link(
						["about_link", "stripe_link"],
						m["privacy.donations.description"](),
						["/about", "https://stripe.com/docs/disputes/prevention/advanced-fraud-detection"],
						[false, true],
					),
				)}
			</p>

			<h2 class="text-xl mb-3">
				{m["privacy.conversion_errors.title"]()}
			</h2>
			<div class="mb-4">
				{m["privacy.conversion_errors.description"]()}
				<ul class="list-disc list-inside mt-2 mb-2">
					<li>{m["privacy.conversion_errors.list_job_id"]()}</li>
					<li>{m["privacy.conversion_errors.list_format_from"]()}</li>
					<li>{m["privacy.conversion_errors.list_format_to"]()}</li>
					<li>{m["privacy.conversion_errors.list_stderr"]()}</li>
					<li>{m["privacy.conversion_errors.list_video"]()}</li>
				</ul>
				{m["privacy.conversion_errors.footer"]()}
			</div>

			<h3 class="text-xl mt-4 mb-2">{m["privacy.analytics.title"]()}</h3>
			<p class="mb-4">
				{@html sanitize(
					link(
						["settings_link", "plausible_link"],
						m["privacy.analytics.description"](),
						[
							"/settings",
							"https://plausible.io/privacy-focused-web-analytics",
						],
						[false, true],
					),
				)}
			</p>

			<h3 class="text-xl mt-4 mb-2">
				{m["privacy.local_storage.title"]()}
			</h3>
			<p class="mb-4">
				{@html sanitize(
					link(
						["settings_link"],
						m["privacy.local_storage.description"](),
						["/settings"],
						[false],
					),
				)}
			</p>

			<h3 class="text-xl mt-4 mb-2">{m["privacy.contact.title"]()}</h3>
			<p class="mb-0">
				{@html sanitize(
					link(
						["email_link"],
						m["privacy.contact.description"](),
						["mailto:hello@vert.sh"],
						[false],
					),
				)}
			</p>

			<p class="text-sm text-muted mt-6">{m["privacy.last_updated"]()}</p>
		</div>
	</div>
</div>
