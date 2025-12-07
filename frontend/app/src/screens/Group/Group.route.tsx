import { Trans } from "@lingui/react/macro";
import { type RouteParams, useRouter } from "expo-router";
import type { ExtendedStackNavigationOptions } from "expo-router/build/layouts/StackClient";
import { Button as UIButton } from "@/ui/components/Button";
import { Icon } from "@/ui/components/Icon";
import { ScreenContentFooter } from "@/ui/components/ScreenContentFooter";

export type GroupRouteParams = RouteParams<"/(screens)/Groups/[groupId]">;

export const GroupRouteOptions: ExtendedStackNavigationOptions = {
	headerBackTitle: "Groups",
	headerBackVisible: true,
	unstable_sheetFooter() {
		const router = useRouter();
		return (
			<ScreenContentFooter
				primary={
					<UIButton
						onPress={() => router.navigate("/(modals)/Groups/New")}
						icon={<Icon name="add-circle-outline" />}
					>
						<Trans>New Expense</Trans>
					</UIButton>
				}
			/>
		);
	},
};
