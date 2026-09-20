<script lang="ts">
	import { page } from "$app/state";
	import { files } from "$lib/store/index.svelte";
	import { m } from "$lib/paraglide/messages";

	const items = $derived<
		{
			name: string;
			url: string;
			activeMatch: (pathname: string) => boolean;
			badge?: number;
		}[]
	>([
		{
			name: m["navbar.convert"](),
			url: "/",
			activeMatch: (pathname) => pathname === "/",
			badge: files.files.length,
		},
		{
			name: m["navbar.settings"](),
			url: "/settings/",
			activeMatch: (pathname) => pathname.startsWith("/settings"),
		},
		{
			name: m["navbar.about"](),
			url: "/about/",
			activeMatch: (pathname) => pathname.startsWith("/about"),
		},
	]);
</script>

<header
	class="sticky top-0 z-50 w-full border-b border-separator backdrop-blur-md"
	style="background: var(--bg-blur);"
>
	<nav
		class="w-full max-w-[100rem] mx-auto px-5 h-16 flex items-center justify-between gap-4"
	>
		<a
			href="/"
			class="flex items-center gap-2 font-bold tracking-tight whitespace-nowrap"
			draggable={false}
		>
			<span class="dot" aria-hidden="true"></span>
			m4rv1n
			<span class="font-display text-sm font-normal text-muted"
				>/ convert</span
			>
		</a>

		<ul class="flex items-stretch gap-1 h-16 m-0 p-0 list-none">
			{#each items as item (item.url)}
				{@const active = item.activeMatch(page.url.pathname)}
				<li class="flex">
					<a
						href={item.url}
						class="flex items-center gap-2 px-3 text-sm font-medium transition-colors {active
							? 'text-foreground'
							: 'text-muted hover:text-foreground hover:bg-hover'}"
						style={active
							? "box-shadow: inset 0 -2px 0 var(--accent);"
							: ""}
						aria-current={active ? "page" : undefined}
						draggable={false}
					>
						{item.name}
						{#if item.badge}
							<span
								class="font-display text-xs px-1.5 py-0.5 rounded bg-badge text-on-badge"
							>
								{item.badge}
							</span>
						{/if}
					</a>
				</li>
			{/each}
		</ul>
	</nav>
</header>
