import { StyleSheet } from "react-native-unistyles";

const FOOTER_HEIGHT = 73;

export const styles = StyleSheet.create((theme, rt) => ({
	container: {
		flex: 1,
		paddingLeft: theme.gap(2) + rt.insets.left,
		paddingRight: theme.gap(2) + rt.insets.right,
		paddingBottom: rt.insets.bottom + FOOTER_HEIGHT,
		variants: {
			variant: {
				primary: {
					backgroundColor: theme.background.primary,
				},
				surface: {
					backgroundColor: theme.background.surface,
				},
			},
		},
	},
	footer: {
		position: "absolute",
		bottom: 0,
		left: 0,
		right: 0,
	},
}));
