import { useLingui } from "@lingui/react/macro";
import { type RouteParams, router } from "expo-router";
import type { ExtendedStackNavigationOptions } from "expo-router/build/layouts/StackClient";
import * as Sharing from "expo-sharing";
import { View } from "react-native";
import { StyleSheet } from "react-native-unistyles";
import { UserContextMenu } from "@/components/ContextMenu";
import { useLazyLocalSearchParams } from "@/hooks/useLazyLocalSearchParams";
import { IconButton } from "@/ui/components/IconButton";

export type GroupRouteParams = RouteParams<"/(screens)/Groups/[groupId]">;

export const GroupRouteOptions: ExtendedStackNavigationOptions = {
	headerBackTitle: "Groups",
	headerBackVisible: true,
	headerRight() {
		const { t } = useLingui();
		const params = useLazyLocalSearchParams<GroupRouteParams>();

		return (
			<View style={styles.buttonContainer}>
				<IconButton
					name="ios-share"
					accessibilityLabel={t`Share group`}
					onPress={() =>
						Sharing.shareAsync("https://google.com", {
							dialogTitle: t`Share group`,
						})
					}
				/>
				<IconButton
					name="edit"
					accessibilityLabel={t`Edit group`}
					onPress={() => {
						router.navigate({
							pathname: "/(modals)/Groups/[groupId]/Edit",
							params: {
								groupId: params.groupId,
							},
						});
					}}
				/>
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
