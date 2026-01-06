import type { ReactNode } from "react";
import type { TextStyle } from "react-native";
import type { SharedValue } from "react-native-reanimated";
import type { UnistylesVariants } from "react-native-unistyles";
import type { A11YProps, Extendable } from "@/ui/ui.types";
import type { styles } from "./Text.styles";

export type TextVariants = UnistylesVariants<typeof styles>;

export type TextProps = {
	children?: ReactNode | SharedValue<string>;
} & A11YProps &
	Extendable<TextStyle> &
	TextVariants;

export type AnimatedTextProps = {
	children?: SharedValue<string>;
} & A11YProps &
	Extendable<TextStyle> &
	TextVariants;
