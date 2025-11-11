import type { A11YProps, PressableComponent } from "@/ui/ui.types";
import { ReactNode } from "react";
import { Pressable } from "react-native";
import { StyleSheet, UnistylesVariants } from "react-native-unistyles";
import { Text } from "../Text";

type ButtonProps = {
	children?: ReactNode;
} & UnistylesVariants<typeof styles> &
	PressableComponent &
	A11YProps;

export function Button({
	onPress,
	children,
	variant = "filled",
	...a11yProps
}: ButtonProps) {
	styles.useVariants({ variant });

	return (
		<Pressable onPress={onPress} style={styles.container} {...a11yProps}>
			<Text containerStyles={styles.text}>{children}</Text>
		</Pressable>
	);
}

const styles = StyleSheet.create((theme) => ({
	container: {
		paddingHorizontal: theme.gap(1),
		paddingVertical: theme.gap(1.5),
		width: "100%",
		alignItems: "center",
		borderRadius: theme.radius.medium,
		variants: {
			variant: {
				filled: {
					backgroundColor: theme.button.primary.background,
				},
			},
		},
	},
	text: {
		variants: {
			variant: {
				filled: {
					color: theme.button.primary.color,
				},
			},
		},
	},
}));
