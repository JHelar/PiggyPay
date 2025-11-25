import { View } from "react-native";
import { StyleSheet } from "react-native-unistyles";
import { renderSlot } from "@/ui/utils/renderSlot";
import type { ListItemProps } from "./ListItem.types";

export function ListItem({ left, middle, right }: ListItemProps) {
	const Left = renderSlot(left);
	const Middle = renderSlot(middle, {
		containerStyles: styles.middle,
	});
	const Right = renderSlot(right);

	return (
		<View style={styles.container}>
			{Left}
			{Middle}
			{Right}
		</View>
	);
}

const styles = StyleSheet.create((theme) => ({
	container: {
		paddingHorizontal: theme.gap(2),
		paddingVertical: theme.gap(1.5),
		rowGap: theme.gap(2),
		flexDirection: "row",
		backgroundColor: theme.background.surface,
		borderRadius: theme.radius.medium,
	},
	middle: {
		flex: 1,
	},
	right: {
		flexDirection: "row",
		rowGap: theme.gap(2),
	},
}));
