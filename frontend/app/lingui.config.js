import { defineConfig } from "@lingui/cli";

export default defineConfig({
	sourceLocale: "en",
	locales: ["sv", "en"],
	catalogs: [
		{
			path: "<rootDir>/i18n/{locale}/messages",
			include: ["./api", "./app", "./ui", "./screens"],
		},
	],
});
