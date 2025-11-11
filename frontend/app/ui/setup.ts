import { StyleSheet } from "react-native-unistyles";
import { TextStyle } from "react-native";

const GAP_SIZE = 8;

export type TextVariants =
	| "headline"
	| "title"
	| "subtitle"
	| "body"
	| "small"
	| "xsmall";

export type TypographyTheme = {
	fontSize: number;
	fontWeight: TextStyle["fontWeight"];
	lineHeight: number;
};

type AppTheme = {
	radius: {
		none: number;
		small: number;
		medium: number;
		large: number;
	};
	background: {
		primary: string;
	};
	text: {
		color: {
			default: string;
			inverted: string;
		};
	};
	typography: Record<TextVariants, TypographyTheme>;
	button: {
		primary: {
			background: string;
			color: string;
		};
	};
	gap(type: number): number;
};

const blueLight: AppTheme = {
	radius: {
		none: 0,
		small: 4,
		medium: 8,
		large: 16,
	},
	background: {
		primary: "#CCF0FF",
	},
	text: {
		color: {
			default: "#000000",
			inverted: "#FFFFFF",
		},
	},
	typography: {
		headline: {
			fontSize: 32,
			fontWeight: 400,
			lineHeight: 40,
		},
		title: {
			fontSize: 22,
			fontWeight: 400,
			lineHeight: 28,
		},
		subtitle: {
			fontSize: 22,
			fontWeight: 400,
			lineHeight: 28,
		},
		body: {
			fontSize: 16,
			fontWeight: 400,
			lineHeight: 18,
		},
		small: {
			fontSize: 14,
			fontWeight: 400,
			lineHeight: 16,
		},
		xsmall: {
			fontSize: 12,
			fontWeight: 400,
			lineHeight: 14,
		},
	},
	button: {
		primary: {
			background: "#007BB6",
			color: "#FFFFFF",
		},
	},
	gap(type) {
		return type * GAP_SIZE;
	},
};

const appThemes = {
	blueLight,
} as const;

type AppThemes = typeof appThemes;

declare module "react-native-unistyles" {
	export interface UnistylesThemes extends AppThemes {}
}

StyleSheet.configure({
	themes: {
		blueLight,
	},
	settings: {
		initialTheme: "blueLight",
	},
});
