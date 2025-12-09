import { Trans, useLingui } from "@lingui/react/macro";
import { type RouteParams, router } from "expo-router";
import type { ExtendedStackNavigationOptions } from "expo-router/build/layouts/StackClient";
import { View } from "react-native";
import { StyleSheet } from "react-native-unistyles";
import { UserContextMenu } from "@/components/ContextMenu";
import { useLazyLocalSearchParams } from "@/hooks/useLazyLocalSearchParams";
import { Button as UIButton } from "@/ui/components/Button";
import { Icon } from "@/ui/components/Icon";
import { IconButton } from "@/ui/components/IconButton";
import { ScreenContentFooter } from "@/ui/components/ScreenContentFooter";

export type GroupRouteParams = RouteParams<"/(screens)/Groups/[groupId]">;

export const GroupRouteOptions: ExtendedStackNavigationOptions = {
	headerBackTitle: "Groups",
	headerBackVisible: true,
	headerRight() {
		const { t } = useLingui();
		const params = useLazyLocalSearchParams<GroupRouteParams>();

		return (
			<View style={styles.buttonContainer}>
				<IconButton name="ios-share" accessibilityLabel={t`Share group`} />
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
	unstable_sheetFooter() {
		const params = useLazyLocalSearchParams<GroupRouteParams>();

		return (
			<ScreenContentFooter
				primary={
					<UIButton
						onPress={() =>
							router.navigate({
								pathname: "/(modals)/Groups/[groupId]/NewExpense",
								params: {
									groupId: params.groupId,
								},
							})
						}
						icon={<Icon name="add-circle-outline" />}
					>
						<Trans>New Expense</Trans>
					</UIButton>
				}
			/>
		);
	},
};

export function createGroupRouteRenderOptions(groupId: string) {
	return {
		headerBackTitle: "Groups",
		headerBackVisible: true,
		headerRight() {
			const { t } = useLingui();
			return (
				<View style={styles.buttonContainer}>
					<IconButton name="ios-share" accessibilityLabel={t`Share group`} />
					<IconButton
						name="edit"
						accessibilityLabel={t`Edit group`}
						onPress={() =>
							router.navigate({
								pathname: "/(modals)/Groups/[groupId]/Edit",
								params: {
									groupId,
								},
							})
						}
					/>
					<UserContextMenu />
				</View>
			);
		},
		unstable_sheetFooter() {
			return (
				<ScreenContentFooter
					primary={
						<UIButton
							onPress={() =>
								router.navigate({
									pathname: "/(modals)/Groups/[groupId]/NewExpense",
									params: {
										groupId,
									},
								})
							}
							icon={<Icon name="add-circle-outline" />}
						>
							<Trans>New Expense</Trans>
						</UIButton>
					}
				/>
			);
		},
	} satisfies ExtendedStackNavigationOptions;
}

const styles = StyleSheet.create((theme) => ({
	buttonContainer: {
		flexDirection: "row",
		columnGap: theme.gap(2),
		alignItems: "center",
	},
}));
