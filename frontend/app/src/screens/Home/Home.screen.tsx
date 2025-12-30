import { Trans } from "@lingui/react/macro";
import { useRouter } from "expo-router";
import { useCallback } from "react";
import { View } from "react-native";
import { StyleSheet } from "react-native-unistyles";
import { Button } from "@/ui/components/Button";
import { Text } from "@/ui/components/Text/Text";

export function HomeScreen() {
	const router = useRouter();
	const onSignIn = useCallback(async () => {
		router.navigate("/SignIn");
	}, [router.navigate]);

	return (
		<View style={styles.container}>
			<Text variant="headline">
				<Trans>Welcome</Trans>
			</Text>
			<Button onPress={onSignIn}>
				<Trans>Sign in</Trans>
			</Button>
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
