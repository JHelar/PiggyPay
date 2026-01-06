import { Trans } from "@lingui/react/macro";
import { useCallback } from "react";
import { View } from "react-native";
import { StyleSheet, UnistylesRuntime } from "react-native-unistyles";
import { Clouds } from "@/components/SVG/Clouds";
import { Logo } from "@/components/SVG/Logo";
import { Pig } from "@/components/SVG/Pig";
import { Button } from "@/ui/components/Button";
import { ScreenContentFooterSpacer } from "@/ui/components/ScreenContentFooter/ScreenContentFooter";
import { useSignInStore } from "../SignIn";

export function HomeScreen() {
	const signIn = useSignInStore(({ start }) => start);
	const onSignIn = useCallback(async () => {
		await signIn();
	}, [signIn]);

	return (
		<>
			<Clouds
				style={{
					position: "absolute",
					top: 0,
				}}
				front={
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
				}
			>
				<Pig />
			</Clouds>
			<View style={styles.container}>
				<Button onPress={onSignIn}>
					<Trans>Start Piggy splitting!</Trans>
				</Button>
				<ScreenContentFooterSpacer />
			</View>
		</>
	);
}

const styles = StyleSheet.create((theme) => ({
	container: {
		flex: 1,
		justifyContent: "flex-end",
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
