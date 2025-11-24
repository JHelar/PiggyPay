import { GlassView } from "expo-glass-effect";
import { StyleSheet } from "react-native-unistyles";
import { renderSlot } from "@/ui/utils/renderSlot";
import type { ScreenContentFooterProps } from "./ScreenContentFooter.types";

export function ScreenContentFooter({
	primary,
	secondary,
	containerStyles,
}: ScreenContentFooterProps) {
	const Primary = renderSlot(primary, { variant: "filled" });
	const Secondary = renderSlot(secondary, { variant: "ghost" });

	return (
		<GlassView style={[styles.container, containerStyles]}>
			{Primary}
			{Secondary}
		</GlassView>
	);
}

const styles = StyleSheet.create((theme, rt) => ({
	container: {
		paddingHorizontal: theme.gap(2),
		paddingTop: theme.gap(1.5),
		paddingBottom: Math.max(rt.insets.bottom, theme.gap(1.5)),
		flexDirection: "row",
		justifyContent: "space-between",
		backgroundColor: theme.background.footer,
	},
}));
