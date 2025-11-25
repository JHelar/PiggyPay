import { Platform, type TextStyle, type ViewStyle } from "react-native";
import { StyleSheet } from "react-native-unistyles";
import { accentPalette, staticPalette } from "./palettes";

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
		secondary: string;
		surfaceInverted: string;
		surface: string;
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
	colorPicker: {
		blue: {
			background: string;
			border: string;
			selected: string;
		};
		green: {
			background: string;
			border: string;
			selected: string;
		};
	};
	gap(type: number): number;
	elevation(
		level: number,
	): Pick<
		ViewStyle,
		"elevation" | "shadowOpacity" | "shadowRadius" | "shadowOffset"
	>;
};

const baseTheme: Pick<AppTheme, "radius" | "typography" | "gap" | "elevation"> =
	{
		radius: {
			none: 0,
			small: 4,
			medium: 8,
			large: 16,
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

const baseLightTheme: Pick<AppTheme, keyof typeof baseTheme | "colorPicker"> = {
	...baseTheme,
	colorPicker: {
		blue: {
			background: accentPalette.blueLight.accentOpacity600,
			border: accentPalette.blueLight.accent600,
			selected: accentPalette.blueLight.accent800,
		},
		green: {
			background: accentPalette.greenLight.accentOpacity600,
			border: accentPalette.greenLight.accent600,
			selected: accentPalette.greenLight.accent800,
		},
	},
};

const blueLight: AppTheme = {
	...baseLightTheme,
	border: {
		primary: accentPalette.blueLight.accent800,
	},

	background: {
		primary: accentPalette.blueLight.accent400,
		secondary: accentPalette.blueLight.accent200,
		surfaceInverted: staticPalette.light.gray1200,
		surface: staticPalette.light.gray200,
		footer: staticPalette.light.grayOpacity200,
	},
	text: {
		color: {
			default: staticPalette.light.black,
			accent: accentPalette.blueLight.accent1200,
			inverted: staticPalette.light.white,
			error: "#FF0000",
		},
	},

	button: {
		primary: {
			background: accentPalette.blueLight.accent1100,
		},
	},
};
const greenLight: AppTheme = {
	...baseLightTheme,
	border: {
		primary: accentPalette.greenLight.accent800,
	},
	radius: {
		none: 0,
		small: 4,
		medium: 8,
		large: 16,
	},
	background: {
		primary: accentPalette.greenLight.accent400,
		secondary: accentPalette.greenLight.accent200,
		surfaceInverted: staticPalette.light.gray1200,
		surface: staticPalette.light.gray200,
		footer: staticPalette.light.grayOpacity200,
	},
	text: {
		color: {
			default: staticPalette.light.black,
			accent: accentPalette.greenLight.accent1200,
			inverted: staticPalette.light.white,
			error: "#FF0000",
		},
	},
	button: {
		primary: {
			background: accentPalette.greenLight.accent1100,
		},
	},
};

const appThemes = {
	blueLight,
	greenLight,
} as const;

export type AppThemes = typeof appThemes;

declare module "react-native-unistyles" {
	export interface UnistylesThemes extends AppThemes {}
}

StyleSheet.configure({
	themes: {
		blueLight,
		greenLight,
	},
	settings: {
		initialTheme: "blueLight",
	},
});
