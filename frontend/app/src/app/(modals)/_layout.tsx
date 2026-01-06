import { Stack } from "expo-router";
import { StyleSheet } from "react-native-unistyles";
import { AuthState, useAuth } from "@/auth";
import { ScreenLayout } from "@/components/ScreenLayout";
import { EditExpenseRouteOptions } from "@/screens/EditExpense";
import { EditGroupRouteOptions } from "@/screens/EditGroup/EditGroup.route";
import { EditProfileRouteOptions } from "@/screens/EditProfile";
import { NewExpenseRouteOptions } from "@/screens/NewExpense/NewExpense.route";
import { NewGroupRouteOptions } from "@/screens/NewGroup";
import { SignInRouteOptions } from "@/screens/SignIn";

export default function ModalLayoutRoot() {
	const authState = useAuth(({ state }) => state);

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
			<Stack.Protected guard={authState === AuthState.UNAUTHORIZED}>
				<Stack.Screen name="SignIn" options={SignInRouteOptions} />
			</Stack.Protected>
			<Stack.Protected guard={authState === AuthState.AUTHORIZED}>
				<Stack.Screen name="User/Edit" options={EditProfileRouteOptions} />
				<Stack.Screen name="Groups/New" options={NewGroupRouteOptions} />
				<Stack.Screen
					name="Groups/[groupId]/Edit"
					options={EditGroupRouteOptions}
				/>
				<Stack.Screen
					name="Groups/[groupId]/NewExpense"
					options={NewExpenseRouteOptions}
				/>
				<Stack.Screen
					name="Groups/[groupId]/[expenseId]/Edit"
					options={EditExpenseRouteOptions}
				/>
			</Stack.Protected>
		</Stack>
	);
}

const styles = StyleSheet.create((theme) => ({
	container: {
		backgroundColor: theme.background.secondary,
	},
}));
