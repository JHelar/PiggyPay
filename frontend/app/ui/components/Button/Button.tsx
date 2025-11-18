import type { ReactNode } from "react";
import { Pressable } from "react-native";
import { StyleSheet, type UnistylesVariants } from "react-native-unistyles";
import type { A11YProps, Extendable, PressableComponent } from "@/ui/ui.types";
import { Text } from "../Text";

type ButtonProps = {
	children?: ReactNode;
	isLoading?: boolean;
} & UnistylesVariants<typeof styles> &
	PressableComponent &
	A11YProps &
	Extendable;

export function Button({
	onPress,
	children,
	variant = "filled",
	containerStyles,
	...a11yProps
}: ButtonProps) {
	styles.useVariants({ variant });

	return (
		<Pressable
			onPress={onPress}
			style={[styles.container, containerStyles]}
			{...a11yProps}
		>
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
				ghost: {},
			},
		},
	},
	text: {
		variants: {
			variant: {
				filled: {
					color: theme.text.color.inverted,
				},
			},
		},
	},
}));
