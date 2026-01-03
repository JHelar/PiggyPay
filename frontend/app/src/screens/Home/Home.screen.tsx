import { Trans } from "@lingui/react/macro";
import { useRouter } from "expo-router";
import { useCallback } from "react";
import { View } from "react-native";
import { StyleSheet, UnistylesRuntime } from "react-native-unistyles";
import { Clouds } from "@/components/SVG/Clouds";
import { Logo } from "@/components/SVG/Logo";
import { Pig } from "@/components/SVG/Pig";
import { Button } from "@/ui/components/Button";

export function HomeScreen() {
	const router = useRouter();
	const onSignIn = useCallback(async () => {
		router.navigate("/SignIn");
	}, [router.navigate]);

	return (
		<>
			<Clouds
				style={{
					position: "absolute",
					top: 0,
				}}
			>
				<Logo
					transform={[
						{
							translateY: UnistylesRuntime.screen.height / 2 - 80.1,
						},
						{
							translateX: UnistylesRuntime.screen.width / 2 - 138.5,
						},
					]}
				/>
				<Pig />
			</Clouds>
			<View style={styles.container}>
				<Button onPress={onSignIn}>
					<Trans>Sign in</Trans>
				</Button>
			</View>
		</>
	);
}

const styles = StyleSheet.create((theme) => ({
	container: {
		flex: 1,
		justifyContent: "flex-end",
		marginBottom: theme.gap(5),
	},
	text: {
		textAlign: "center",
	},
	headline: {
		marginBottom: theme.gap(2),
	},
	subHeadline: {
		marginBottom: theme.gap(8),
	},
}));
