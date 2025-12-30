import type { RouteParams } from "expo-router";
import type { ExtendedStackNavigationOptions } from "expo-router/build/layouts/StackClient";
import { UserContextMenu } from "@/components/ContextMenu";

export type PayRouteParams = RouteParams<"/(screens)/Groups/[groupId]/Pay">;

export const PayRouteOptions: ExtendedStackNavigationOptions = {
	headerBackTitle: "Group",
	headerBackVisible: true,
	headerRight() {
		return <UserContextMenu />;
	},
};
