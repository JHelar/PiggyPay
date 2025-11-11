import { ScreenContent } from "@/ui/components/ScreenContent";
import { Stack } from "expo-router";
import { Suspense } from "react";
import { StyleSheet } from "react-native-unistyles";

export default function RootLayout() {
	return (
		<Stack
			screenOptions={{
				headerTransparent: true,
				headerTintColor: styles.backButton.color,
			}}
			screenLayout={({ children }) => (
				<ScreenContent>
					<Suspense>{children}</Suspense>
				</ScreenContent>
			)}
			initialRouteName="index"
		>
			<Stack.Screen name="index" options={{ headerTitle: "" }} />
			<Stack.Screen name="signIn" options={{ headerTitle: "Sign in" }} />
		</Stack>
	);
}

const styles = StyleSheet.create((theme) => ({
	backButton: {
		color: theme.text.color.default,
	},
}));
