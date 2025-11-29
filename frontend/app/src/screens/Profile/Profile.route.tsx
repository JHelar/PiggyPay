import { Trans } from "@lingui/react/macro";
import { useRouter } from "expo-router";
import type { ExtendedStackNavigationOptions } from "expo-router/build/layouts/StackClient";
import { View } from "react-native";
import { Button } from "@/ui/components/Button";

export const ProfileRouteOptions: ExtendedStackNavigationOptions = {
	headerRight() {
		const router = useRouter();
		return (
			<View>
				<Button
					variant="ghost"
					onPress={() => router.push("/(modals)/User/Edit")}
				>
					<Trans>Edit</Trans>
				</Button>
			</View>
		);
	},
};
