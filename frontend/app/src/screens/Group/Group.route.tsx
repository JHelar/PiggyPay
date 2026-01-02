import { useLingui } from "@lingui/react/macro";
import { useQuery } from "@tanstack/react-query";
import { createURL } from "expo-linking";
import { type RouteParams, router } from "expo-router";
import type { ExtendedStackNavigationOptions } from "expo-router/build/layouts/StackClient";
import { Share, View } from "react-native";
import { StyleSheet } from "react-native-unistyles";
import { getMemberInfo, MemberRole } from "@/api/member";
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
		const { data: memberInfo } = useQuery(
			getMemberInfo(params.groupId.toString()),
		);

		return (
			<View style={styles.buttonContainer}>
				{memberInfo?.member_role === MemberRole.enum.Admin && (
					<>
						<IconButton
							name="ios-share"
							accessibilityLabel={t`Share group`}
							onPress={() =>
								Share.share({
									url: createURL(`groups/${params.groupId}/invite`),
									title: t`Invite members`,
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
					</>
				)}

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
