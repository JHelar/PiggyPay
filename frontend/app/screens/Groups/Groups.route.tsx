import { Button, ContextMenu, Host } from "@expo/ui/swift-ui";
import { Trans, useLingui } from "@lingui/react/macro";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import type { ExtendedStackNavigationOptions } from "expo-router/build/layouts/StackClient";
import { getUser, signOut } from "@/api/user";
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
			<Host>
				<ContextMenu>
					<ContextMenu.Items>
						<Button
							systemImage="person.circle"
							onPress={() => router.navigate("/(screens)/User")}
						>
							{data.first_name} {data.last_name}
						</Button>
						<Button
							variant="bordered"
							systemImage="pencil"
							onPress={() => router.navigate("/(modals)/User/Edit")}
						>
							{t`Edit profile`}
						</Button>
						<Button
							variant="bordered"
							systemImage="rectangle.portrait.and.arrow.right"
							onPress={signOutMutation}
						>
							{t`Sign out`}
						</Button>
					</ContextMenu.Items>
					<ContextMenu.Trigger>
						<IconButton
							name="initials"
							accessibilityLabel={t`Open menu`}
							firstName={data.first_name}
							lastName={data.last_name}
						/>
					</ContextMenu.Trigger>
				</ContextMenu>
			</Host>
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
