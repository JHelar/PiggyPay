import { StyleSheet } from "react-native-unistyles";

export const styles = StyleSheet.create((theme, rt) => ({
	container: {
		flex: 1,
		paddingLeft: theme.gap(2) + rt.insets.left,
		paddingRight: theme.gap(2) + rt.insets.right,
		paddingBottom: rt.insets.bottom,
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
}));
