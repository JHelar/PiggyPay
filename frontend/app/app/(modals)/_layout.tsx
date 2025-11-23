import { Stack } from "expo-router";
import { StyleSheet } from "react-native-unistyles";
import { ScreenLayout } from "@/components/ScreenLayout";

export default function ModalLayoutRoot() {
	return (
		<Stack
			screenOptions={{
				headerTransparent: true,
				presentation: "modal",
				contentStyle: styles.container,
				headerShown: true,
			}}
			screenLayout={({ children }) => {
				return <ScreenLayout variant="surface">{children}</ScreenLayout>;
			}}
		/>
	);
}

const styles = StyleSheet.create((theme) => ({
	container: {
		backgroundColor: theme.background.surface,
	},
}));
