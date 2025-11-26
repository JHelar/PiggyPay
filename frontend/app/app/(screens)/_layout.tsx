import { Stack } from "expo-router";
import { StyleSheet } from "react-native-unistyles";
import { AuthState, useAuth } from "@/auth";
import { ScreenLayout } from "@/components/ScreenLayout";
import { GroupRouteOptions } from "@/screens/Group";
import { GroupsRouteOptions } from "@/screens/Groups";
import { HomeRouteOptions } from "@/screens/Home";
import { ProfileRouteOptions } from "@/screens/Profile";
import { SignInRouteOptions } from "@/screens/SignIn";
import type { RenderSlot } from "@/ui/utils/renderSlot";

export default function ScreenLayoutRoot() {
	const authState = useAuth(({ state }) => state);

	return (
		<Stack
			screenOptions={{
				headerTransparent: true,
				headerTintColor: styles.backButton.color,
				headerTitle: "",
			}}
			screenLayout={({ children, options }) => {
				return (
					<ScreenLayout
						variant="primary"
						footer={options.unstable_sheetFooter?.() as RenderSlot}
					>
						{children}
					</ScreenLayout>
				);
			}}
		>
			<Stack.Protected guard={authState === AuthState.UNAUTHORIZED}>
				<Stack.Screen name="index" options={HomeRouteOptions} />
				<Stack.Screen name="SignIn" options={SignInRouteOptions} />
			</Stack.Protected>
			<Stack.Protected guard={authState === AuthState.AUTHORIZED}>
				<Stack.Screen name="Groups/index" options={GroupsRouteOptions} />
				<Stack.Screen
					name="Groups/[groupId]/index"
					options={GroupRouteOptions}
				/>
				<Stack.Screen name="User/index" options={ProfileRouteOptions} />
			</Stack.Protected>
		</Stack>
	);
}

const styles = StyleSheet.create((theme) => ({
	backButton: {
		color: theme.text.color.default,
	},
	header(headerHeight) {
		return {
			paddingTop: theme.gap(1) + headerHeight,
		};
	},
}));
