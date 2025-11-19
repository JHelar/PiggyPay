import { Button, ContextMenu, Host } from "@expo/ui/swift-ui";
import { useQuery } from "@tanstack/react-query";
import type { ExtendedStackNavigationOptions } from "expo-router/build/layouts/StackClient";
import { getUser } from "@/api/user";
import { unauthorize } from "@/auth/auth.store";
import { Icon } from "@/ui/components/Icon";
import { IconButton } from "@/ui/components/IconButton";
import { Text } from "@/ui/components/Text";

export const GroupsRouteOptions: ExtendedStackNavigationOptions = {
	headerLeft() {
		return <Text variant="body">Groups</Text>;
	},
	headerRight() {
		const { data } = useQuery(getUser());
		if (data === undefined) return;

		return (
			<Host>
				<ContextMenu>
					<ContextMenu.Items>
						<Button
							variant="bordered"
							systemImage="pencil"
							onPress={() => console.log("Pressed2")}
						>
							Edit profile
						</Button>
						<Button
							variant="bordered"
							systemImage="rectangle.portrait.and.arrow.right"
							onPress={unauthorize}
						>
							Sign out
						</Button>
					</ContextMenu.Items>
					<ContextMenu.Trigger>
						<IconButton
							name="initials"
							accessibilityLabel="Open menu"
							firstName={data.first_name}
							lastName={data.last_name}
						/>
					</ContextMenu.Trigger>
				</ContextMenu>
			</Host>
		);
	},
};
