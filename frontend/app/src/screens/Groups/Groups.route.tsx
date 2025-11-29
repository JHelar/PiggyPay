import { Trans } from "@lingui/react/macro";
import { useRouter } from "expo-router";
import type { ExtendedStackNavigationOptions } from "expo-router/build/layouts/StackClient";
import { UserContextMenu } from "@/components/ContextMenu";
import { Button as UIButton } from "@/ui/components/Button";
import { Icon } from "@/ui/components/Icon";
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
	headerRight: UserContextMenu,
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
