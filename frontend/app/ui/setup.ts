import { Platform, type TextStyle, type ViewStyle } from "react-native";
import { StyleSheet } from "react-native-unistyles";

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
	border: {
		primary: string;
	};
	background: {
		primary: string;
		surface: string;
		inverted: string;
		footer: string;
	};
	text: {
		color: {
			default: string;
			inverted: string;
			accent: string;
			error: string;
		};
	};
	typography: Record<TextVariants, TypographyTheme>;
	button: {
		primary: {
			background: string;
		};
	};
	input: {
		background: string;
	};
	gap(type: number): number;
	elevation(
		level: number,
	): Pick<
		ViewStyle,
		"elevation" | "shadowOpacity" | "shadowRadius" | "shadowOffset"
	>;
};

const blueLight: AppTheme = {
	border: {
		primary: "#1CB6F8",
	},
	radius: {
		none: 0,
		small: 4,
		medium: 8,
		large: 16,
	},
	background: {
		primary: "#CCF0FF",
		surface: "#F9F9F9",
		inverted: "#202020",
		footer: "#0000000d",
	},
	input: {
		background: "#F9F9F9",
	},
	text: {
		color: {
			default: "#000000",
			accent: "#003C5F",
			inverted: "#FFFFFF",
			error: "#FF0000",
		},
	},
	typography: {
		headline: {
			fontSize: 32,
			fontWeight: 400,
			lineHeight: 32,
		},
		title: {
			fontSize: 22,
			fontWeight: 400,
			lineHeight: 22,
		},
		subtitle: {
			fontSize: 22,
			fontWeight: 400,
			lineHeight: 22,
		},
		body: {
			fontSize: 16,
			fontWeight: 400,
			lineHeight: 16,
		},
		small: {
			fontSize: 14,
			fontWeight: 600,
			lineHeight: 14,
		},
		xsmall: {
			fontSize: 12,
			fontWeight: 600,
			lineHeight: 12,
		},
	},
	button: {
		primary: {
			background: "#007BB6",
		},
	},
	gap(type) {
		return type * GAP_SIZE;
	},
	elevation(level) {
		return {
			...Platform.select({
				android: {
					elevation: level,
				},
				ios: {
					shadowOpacity: 0.1 * level,
					shadowRadius: level,
					shadowOffset: {
						height: 0,
						width: 0,
					},
				},
			}),
		};
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
