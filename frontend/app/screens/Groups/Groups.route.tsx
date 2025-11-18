import type { ExtendedStackNavigationOptions } from "expo-router/build/layouts/StackClient";
import { Text } from "@/ui/components/Text";

export const GroupsRouteOptions: ExtendedStackNavigationOptions = {
	headerLeft() {
		return <Text variant="body">Groups</Text>;
	},
};
