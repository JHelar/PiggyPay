import type { ReactNode } from "react";
import {
	type AccessibilityRole,
	Text as RNText,
	type TextStyle,
} from "react-native";
import { StyleSheet, type UnistylesVariants } from "react-native-unistyles";
import type { A11YProps, Extendable } from "@/ui/ui.types";

type TextVariants = UnistylesVariants<typeof styles>;

type TextProps = {
	children?: ReactNode;
} & A11YProps &
	Extendable<TextStyle> &
	TextVariants;

const TextAccessibilityRole: Partial<
	Record<NonNullable<TextVariants["variant"]>, AccessibilityRole>
> = {
	headline: "header",
	title: "header",
};

export function Text({
	children,
	containerStyles,
	variant = "body",
}: TextProps) {
	styles.useVariants({ variant });

	return (
		<RNText
			style={[styles.text, containerStyles]}
			accessibilityRole={TextAccessibilityRole[variant]}
		>
			{children}
		</RNText>
	);
}

const styles = StyleSheet.create((theme) => ({
	text: {
		color: theme.text.color.default,
		variants: {
			variant: {
				headline: {
					...theme.typography.headline,
				},
				title: {
					...theme.typography.title,
				},
				subtitle: {
					...theme.typography.subtitle,
				},
				body: {
					...theme.typography.body,
				},
				small: {
					...theme.typography.small,
				},
				xsmall: {
					...theme.typography.xsmall,
				},
			},
		},
	},
}));
