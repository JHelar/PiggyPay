import { View } from "react-native";
import { StyleSheet } from "react-native-unistyles";
import { Button } from "@/ui/components/Button";
import { Text } from "@/ui/components/Text/Text";
import { useSignInStore } from "../SignIn";

export function HomeScreen() {
	return (
		<View style={styles.container}>
			<Text variant="headline">Welcome</Text>
			<Button onPress={useSignInStore.getState().start}>Sign in</Button>
		</View>
	);
}

const styles = StyleSheet.create((theme) => ({
	container: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		rowGap: theme.gap(2),
	},
}));
