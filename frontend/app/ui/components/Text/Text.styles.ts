import { StyleSheet } from "react-native-unistyles";

export const styles = StyleSheet.create((theme) => ({
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
