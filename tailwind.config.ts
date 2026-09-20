import type { Config } from "tailwindcss";
import plugin from "tailwindcss/plugin";

export default {
	content: ["./src/**/*.{html,js,svelte,ts}"],
	theme: {
		extend: {
			backgroundColor: {
				panel: "var(--bg-panel)",
				"panel-highlight": "var(--bg-panel-highlight)",
				separator: "var(--bg-separator)",
				button: "var(--bg-button)",
				"panel-alt": "var(--bg-hover)",
				hover: "var(--bg-hover)",
				badge: "var(--bg-badge)",
			},
			borderColor: {
				separator: "var(--bg-separator)",
				button: "var(--bg-button)",
				strong: "var(--bg-border-strong)",
				muted: "var(--fg-muted)",
				accent: "var(--accent)",
			},
			textColor: {
				foreground: "var(--fg)",
				muted: "var(--fg-muted)",
				accent: "var(--fg-accent)",
				failure: "var(--fg-failure)",
				"on-accent": "var(--fg-on-accent)",
				"on-badge": "var(--fg-on-badge)",
			},
			colors: {
				accent: "var(--accent)",
				"accent-alt": "var(--accent-alt)",
				"accent-pink": "var(--accent-pink)",
				"accent-pink-alt": "var(--accent-pink-alt)",
				"accent-red": "var(--accent-red)",
				"accent-red-alt": "var(--accent-red-alt)",
				"accent-purple-alt": "var(--accent-purple-alt)",
				"accent-purple": "var(--accent-purple)",
				"accent-blue": "var(--accent-blue)",
				"accent-blue-alt": "var(--accent-blue-alt)",
				"accent-green": "var(--accent-green)",
				"accent-green-alt": "var(--accent-green-alt)",
			},
			boxShadow: {
				panel: "var(--shadow-panel)",
			},
			fontFamily: {
				display: "var(--font-display)",
				body: "var(--font-body)",
			},
			blur: {
				xs: "2px",
			},
			borderRadius: {
				"2.5xl": "1.25rem",
			},
		},
	},

	plugins: [
		plugin(function ({ addVariant }) {
			// The theme is dark unconditionally, so dynadark always matches.
			// Keeping the variant means components can stay untouched.
			addVariant("dynadark", ["&"]);
		}),
	],
} satisfies Config;
