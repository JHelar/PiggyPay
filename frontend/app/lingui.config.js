import { defineConfig } from "@lingui/cli";

export default defineConfig({
	sourceLocale: "en",
	locales: ["sv", "en"],
	catalogs: [
		{
			path: "<rootDir>/src/i18n/{locale}/messages",
			include: ["./src"],
		},
	],
});
