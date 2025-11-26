import { Trans, useLingui } from "@lingui/react/macro";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import type { ExtendedStackNavigationOptions } from "expo-router/build/layouts/StackClient";
import { getUser, signOut } from "@/api/user";
import { ContextMenu } from "@/components/ContextMenu";
import { Button as UIButton } from "@/ui/components/Button";
import { Icon } from "@/ui/components/Icon";
import { IconButton } from "@/ui/components/IconButton";
import { ScreenContentFooter } from "@/ui/components/ScreenContentFooter";
import { Text } from "@/ui/components/Text";

export const GroupsRouteOptions: ExtendedStackNavigationOptions = {
	headerLeft() {
		return (
			<Text variant="body">
				<Trans>Groups</Trans>
			</Text>
		);
	},
	headerRight() {
		const { data } = useQuery(getUser());
		const { mutate: signOutMutation } = useMutation(signOut());
		const { t } = useLingui();
		const router = useRouter();

		if (data === undefined) return;

		return (
			<ContextMenu
				actions={[
					{
						icon: "user",
						title: `${data.first_name} ${data.last_name}`,
						onPress: () => router.navigate("/(screens)/User"),
					},
					{
						icon: "edit",
						title: t`Edit profile`,
						onPress: () => router.navigate("/(modals)/User/Edit"),
					},
					{
						icon: "signOut",
						title: t`Sign out`,
						onPress: signOutMutation,
					},
				]}
				trigger={
					<IconButton
						name="initials"
						accessibilityLabel={t`Open menu`}
						firstName={data.first_name}
						lastName={data.last_name}
					/>
				}
			/>
		);
	},
	unstable_sheetFooter() {
		const router = useRouter();
		return (
			<ScreenContentFooter
				primary={
					<UIButton
						onPress={() => router.navigate("/(modals)/Groups/New")}
						icon={<Icon name="add-circle-outline" />}
					>
						<Trans>New group</Trans>
					</UIButton>
				}
			/>
		);
	},
};
