import { Stack } from "expo-router";
import { StyleSheet } from "react-native-unistyles";
import { ScreenLayout } from "@/components/ScreenLayout";
import { EditProfileRouteOptions } from "@/screens/EditProfile";
import { NewGroupRouteOptions } from "@/screens/NewGroup";

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
		>
			<Stack.Screen name="User/Edit" options={EditProfileRouteOptions} />
			<Stack.Screen name="Groups/New" options={NewGroupRouteOptions} />
		</Stack>
	);
}

const styles = StyleSheet.create((theme) => ({
	container: {
		backgroundColor: theme.background.secondary,
	},
}));
