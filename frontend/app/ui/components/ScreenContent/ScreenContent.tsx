import type { ReactNode } from "react";
import { View } from "react-native";
import { StyleSheet } from "react-native-unistyles";
import type { Extendable } from "@/ui/ui.types";

type ScreenProps = {
	children?: ReactNode;
} & Extendable;

export function ScreenContent({ children, containerStyles }: ScreenProps) {
	return <View style={[styles.container, containerStyles]}>{children}</View>;
}

const styles = StyleSheet.create((theme, rt) => ({
	container: {
		flex: 1,
		backgroundColor: theme.background.primary,
		paddingLeft: theme.gap(2) + rt.insets.left,
		paddingRight: theme.gap(2) + rt.insets.right,
	},
}));
