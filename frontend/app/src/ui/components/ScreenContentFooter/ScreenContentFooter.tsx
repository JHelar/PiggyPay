import { BlurView } from "expo-blur";
import { GlassView, isLiquidGlassAvailable } from "expo-glass-effect";
import { View } from "react-native";
import { StyleSheet, UnistylesRuntime } from "react-native-unistyles";
import type { Extendable } from "@/ui/ui.types";
import { renderSlot } from "@/ui/utils/renderSlot";
import type { ScreenContentFooterProps } from "./ScreenContentFooter.types";

export const FOOTER_HEIGHT = 60 + UnistylesRuntime.insets.bottom;

export function ScreenContentFooterSpacer({ style }: Extendable) {
	return <View style={[styles.spacer, style]}></View>;
}

export function ScreenContentFooter({
	primary,
	secondary,
	style: containerStyles,
}: ScreenContentFooterProps) {
	const Primary = renderSlot(primary, { variant: "filled" });
	const Secondary = renderSlot(secondary, { variant: "ghost" });

	if (isLiquidGlassAvailable()) {
		return (
			<GlassView style={[styles.container, containerStyles]}>
				{Primary}
				{Secondary}
			</GlassView>
		);
	}

	return (
		<BlurView
			style={[styles.container, containerStyles]}
			tint="default"
			intensity={30}
		>
			{Primary}
			{Secondary}
		</BlurView>
	);
}

const styles = StyleSheet.create((theme, rt) => ({
	spacer: {
		height: FOOTER_HEIGHT + theme.gap(2),
	},
	container: {
		flexDirection: "row",
		justifyContent: "space-between",
		width: rt.screen.width,
		paddingHorizontal: theme.gap(2),
		paddingTop: theme.gap(1.5),
		paddingBottom: Math.max(rt.insets.bottom, theme.gap(1.5)),
		backgroundColor: theme.background.transparent,
		height: FOOTER_HEIGHT,
	},
}));
