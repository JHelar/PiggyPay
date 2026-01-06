import { StyleSheet } from "react-native-unistyles";

export const styles = StyleSheet.create((theme) => ({
	container: {
		paddingHorizontal: theme.gap(1),
		paddingVertical: theme.gap(2),
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
