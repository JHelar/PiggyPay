import { Stack } from "expo-router";
import { StyleSheet } from "react-native-unistyles";
import { AuthState, useAuth } from "@/auth";
import { ScreenLayout } from "@/components/ScreenLayout";
import { GroupsRouteOptions } from "@/screens/Groups";
import { HomeRouteOptions } from "@/screens/Home";
import { ProfileRouteOptions } from "@/screens/Profile";
import { SignInRouteOptions } from "@/screens/SignIn";

export default function ScreenLayoutRoot() {
	const authState = useAuth(({ state }) => state);

	return (
		<Stack
			screenOptions={{
				headerTransparent: true,
				headerTintColor: styles.backButton.color,
				headerTitle: "",
			}}
			screenLayout={({ children }) => {
				return <ScreenLayout variant="primary">{children}</ScreenLayout>;
			}}
		>
			<Stack.Protected guard={authState === AuthState.UNAUTHORIZED}>
				<Stack.Screen name="index" options={HomeRouteOptions} />
				<Stack.Screen name="SignIn" options={SignInRouteOptions} />
			</Stack.Protected>
			<Stack.Protected guard={authState === AuthState.AUTHORIZED}>
				<Stack.Screen name="Groups/index" options={GroupsRouteOptions} />
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
