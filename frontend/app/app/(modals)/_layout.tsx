import { Stack } from "expo-router";
import { StyleSheet } from "react-native-unistyles";
import { ScreenLayout } from "@/components/ScreenLayout";
import { EditProfileRouteOptions } from "@/screens/EditProfile";

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
				console.log("Running surface");
				return <ScreenLayout variant="surface">{children}</ScreenLayout>;
			}}
		>
			<Stack.Screen name="User/Edit" options={EditProfileRouteOptions} />
		</Stack>
	);
}

const styles = StyleSheet.create((theme) => ({
	container: {
		backgroundColor: theme.background.surface,
	},
}));
