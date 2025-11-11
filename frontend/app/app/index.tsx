import { Button } from "@/ui/components/Button";
import { Text } from "@/ui/components/Text/Text";
import { useRouter } from "expo-router";
import { View } from "react-native";
import { StyleSheet } from "react-native-unistyles";

export default function Index() {
	const router = useRouter();

	return (
		<View style={styles.container}>
			<Text variant="headline">Welcome</Text>
			<Button onPress={() => router.navigate("/signIn")}>Sign in</Button>
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
