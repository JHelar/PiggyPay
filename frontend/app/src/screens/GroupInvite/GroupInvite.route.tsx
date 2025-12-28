import type { RouteParams } from "expo-router";
import type { ExtendedStackNavigationOptions } from "expo-router/build/layouts/StackClient";
import { View } from "react-native";
import { StyleSheet } from "react-native-unistyles";
import { UserContextMenu } from "@/components/ContextMenu";

export type GroupInviteRouteParams =
	RouteParams<"/(screens)/Groups/[groupId]/Invite">;

export const GroupInviteRouteOptions: ExtendedStackNavigationOptions = {
	headerBackTitle: "Home",
	headerBackVisible: true,
	headerRight() {
		return (
			<View style={styles.buttonContainer}>
				<UserContextMenu />
			</View>
		);
	},
};

const styles = StyleSheet.create((theme) => ({
	buttonContainer: {
		flexDirection: "row",
		columnGap: theme.gap(2),
		alignItems: "center",
	},
}));
