import { StyleSheet } from "react-native-unistyles";

export const styles = StyleSheet.create((theme) => ({
	container: {
		paddingHorizontal: theme.gap(1),
		justifyContent: "center",
		borderRadius: theme.radius.medium,
		columnGap: theme.gap(1),
		flexDirection: "row",
		alignItems: "center",
		variants: {
			variant: {
				filled: {
					backgroundColor: theme.surface.primary,
				},
				ghost: {},
				"ghost-inverted": {},
				destructive: {},
			},
			header: {
				true: {},
				false: {
					paddingVertical: theme.gap(2),
				},
			},
		},
	},
	text: {
		variants: {
			header: {
				true: {},
				false: {},
			},
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
			header: {
				true: {},
				false: {},
			},
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
