import { useLingui } from "@lingui/react/macro";
import { View } from "react-native";
import { StyleSheet } from "react-native-unistyles";
import { Button } from "../Button";
import { IconButton } from "../IconButton";
import { Text } from "../Text";
import type { SnackbarProps } from "./Snackbar.types";

export function Snackbar({ text, action, onClose }: SnackbarProps) {
	const { t } = useLingui();
	return (
		<View style={styles.container}>
			<Text variant="body" style={styles.text}>
				{text}
			</Text>
			{action && (
				<Button
					onPress={action.onAction}
					style={styles.action}
					variant="ghost-inverted"
				>
					{action.text}
				</Button>
			)}
			{onClose && (
				<IconButton
					name="close"
					onPress={onClose}
					accessibilityLabel={t`Close`}
					style={styles.icon}
				/>
			)}
		</View>
	);
}

const styles = StyleSheet.create((theme) => ({
	container: {
		backgroundColor: theme.background.surfaceInverted,
		flexDirection: "row",
		padding: theme.gap(2),
		borderRadius: theme.radius.small,
		width: "100%",
		alignItems: "center",
		columnGap: theme.gap(1),
		...theme.elevation(3),
	},
	icon: {
		color: theme.text.color.inverted,
	},
	action: {
		color: theme.text.color.inverted,
		paddingVertical: 0,
	},
	text: {
		flex: 1,
		color: theme.text.color.inverted,
	},
}));
