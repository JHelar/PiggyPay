import { View } from "react-native";
import { StyleSheet } from "react-native-unistyles";
import { Text } from "../Text";
import type { DataRowProps } from "./DataRow.types";

export function DataRow({ label, data: title }: DataRowProps) {
	return (
		<View
			accessible
			accessibilityLabel={`${label}, ${title}`}
			style={styles.container}
		>
			<Text
				variant="xsmall"
				accessible={false}
				importantForAccessibility="no"
				accessibilityElementsHidden
			>
				{label}
			</Text>
			<Text
				variant="body"
				accessible={false}
				importantForAccessibility="no"
				accessibilityElementsHidden
			>
				{title}
			</Text>
		</View>
	);
}

const styles = StyleSheet.create((theme) => ({
	container: {
		rowGap: theme.gap(1),
	},
}));
