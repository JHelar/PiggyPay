import { i18n } from "@lingui/core";
import { msg } from "@lingui/core/macro";
import { Trans } from "@lingui/react/macro";
import { type RouteParams, useRouter } from "expo-router";
import type { ExtendedStackNavigationOptions } from "expo-router/build/layouts/StackClient";
import { Button } from "@/ui/components/Button";

export type EditExpenseRouteParams =
	RouteParams<"/(modals)/Groups/[groupId]/[expenseId]/Edit">;

const headerTitleMessage = msg`Edit expense`;

export const EditExpenseRouteOptions: ExtendedStackNavigationOptions = {
	headerTitle: i18n._(headerTitleMessage),
	headerLeft() {
		const router = useRouter();
		return (
			<Button variant="ghost" onPress={() => router.back()}>
				<Trans>Close</Trans>
			</Button>
		);
	},
	headerRight() {
		return (
			<Button variant="ghost">
				<Trans>Done</Trans>
			</Button>
		);
	},
};
