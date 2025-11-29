import { Pressable, View } from "react-native";
import Animated from "react-native-reanimated";
import { StyleSheet } from "react-native-unistyles";
import { renderSlot } from "@/ui/utils/renderSlot";
import type { ListItemProps } from "./ListItem.types";

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export function ListItem({
	left,
	middle,
	right,
	onPress,
	...a11yProps
}: ListItemProps) {
	const Left = renderSlot(left);
	const Middle = renderSlot(middle, {
		style: styles.middle,
	});
	const Right = renderSlot(right, {
		style: styles.right,
	});

	if (onPress) {
		return (
			<AnimatedPressable
				style={styles.container}
				onPress={onPress}
				{...a11yProps}
			>
				{Left}
				{Middle}
				{Right}
			</AnimatedPressable>
		);
	}

	return (
		<View style={styles.container} {...a11yProps}>
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
		alignItems: "center",
		backgroundColor: theme.background.surface,
		borderRadius: theme.radius.medium,
	},
	middle: {
		flex: 1,
	},
	right: {
		flexDirection: "row",
		alignItems: "center",
		columnGap: theme.gap(2),
	},
}));
