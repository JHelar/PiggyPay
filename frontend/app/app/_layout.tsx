import { useHeaderHeight } from "@react-navigation/elements";
import { QueryClientProvider } from "@tanstack/react-query";
import { Stack } from "expo-router";
import { Protected } from "expo-router/build/views/Protected";
import { type PropsWithChildren, Suspense } from "react";
import { StyleSheet } from "react-native-unistyles";
import { AuthState, useAuth } from "@/auth";
import { queryClient } from "@/query";
import { GroupsRouteOptions } from "@/screens/Groups";
import { HomeRouteOptions } from "@/screens/Home";
import { SignInRouteOptions } from "@/screens/SignIn";
import { ScreenContent } from "@/ui/components/ScreenContent";

function ScreenLayout({ children }: PropsWithChildren) {
	const headerHeight = useHeaderHeight();
	return (
		<ScreenContent containerStyles={styles.header(headerHeight)}>
			<Suspense>{children}</Suspense>
		</ScreenContent>
	);
}

export default function RootLayout() {
	const authState = useAuth(({ state }) => state);
	return (
		<QueryClientProvider client={queryClient}>
			<Stack
				screenOptions={{
					headerTransparent: true,
					headerTintColor: styles.backButton.color,
					headerTitle: "",
				}}
				screenLayout={({ children }) => <ScreenLayout>{children}</ScreenLayout>}
			>
				<Protected guard={authState === AuthState.UNAUTHORIZED}>
					<Stack.Screen name="Home" options={HomeRouteOptions} />
					<Stack.Screen name="SignIn" options={SignInRouteOptions} />
				</Protected>
				<Protected guard={authState === AuthState.AUTHORIZED}>
					<Stack.Screen name="Groups/index" options={GroupsRouteOptions} />
				</Protected>
			</Stack>
		</QueryClientProvider>
	);
}

const styles = StyleSheet.create((theme) => ({
	backButton: {
		color: theme.text.color.default,
	},
	header(headerHeight) {
		return {
			paddingTop: theme.gap(2) + headerHeight,
		};
	},
}));
