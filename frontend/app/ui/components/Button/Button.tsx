import type { ReactNode } from "react";
import { Pressable } from "react-native";
import { StyleSheet, type UnistylesVariants } from "react-native-unistyles";
import type { A11YProps, Extendable, PressableComponent } from "@/ui/ui.types";
import { type RenderSlot, renderSlot } from "@/ui/utils/renderSlot";
import type { IconProps } from "../Icon";
import { Text } from "../Text";

type ButtonProps = {
	children?: ReactNode;
	isLoading?: boolean;
	icon?: RenderSlot<IconProps>;
} & UnistylesVariants<typeof styles> &
	PressableComponent &
	A11YProps &
	Extendable;

export function Button({
	onPress,
	children,
	variant = "filled",
	containerStyles,
	icon,
	...a11yProps
}: ButtonProps) {
	styles.useVariants({ variant });

	const Icon = renderSlot(icon, {
		containerStyles: styles.icon,
	});

	return (
		<Pressable
			onPress={onPress}
			style={[styles.container, containerStyles]}
			{...a11yProps}
		>
			{Icon}
			<Text containerStyles={styles.text} variant="body">
				{children}
			</Text>
		</Pressable>
	);
}

const styles = StyleSheet.create((theme) => ({
	container: {
		paddingHorizontal: theme.gap(1),
		paddingVertical: theme.gap(1.5),
		justifyContent: "center",
		borderRadius: theme.radius.medium,
		columnGap: theme.gap(1),
		flexDirection: "row",
		alignItems: "center",
		variants: {
			variant: {
				filled: {
					backgroundColor: theme.button.primary.background,
				},
				ghost: {},
				"ghost-inverted": {},
				destructive: {},
			},
		},
	},
	text: {
		variants: {
			variant: {
				filled: {
					color: theme.text.color.inverted,
				},
				destructive: {
					color: theme.text.color.error,
				},
				ghost: {
					color: theme.text.color.default,
				},
				"ghost-inverted": {
					color: theme.text.color.inverted,
				},
			},
		},
	},
	icon: {
		variants: {
			variant: {
				filled: {
					color: theme.text.color.inverted,
				},
				destructive: {
					color: theme.text.color.error,
				},
				ghost: {
					color: theme.text.color.default,
				},
				"ghost-inverted": {
					color: theme.text.color.inverted,
				},
			},
		},
	},
}));
