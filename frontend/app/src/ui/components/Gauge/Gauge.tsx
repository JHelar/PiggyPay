import { Canvas, Path, Skia } from "@shopify/react-native-skia";
import { useRef } from "react";
import { View } from "react-native";
import { useDerivedValue } from "react-native-reanimated";
import { StyleSheet, useUnistyles } from "react-native-unistyles";
import { renderSlot } from "@/ui/utils/renderSlot";
import { Text } from "../Text";
import type { GaugeProps } from "./Gauge.types";

const SIZE = 20;
const HEIGHT = 120;
const WIDTH = 120;

export function Gauge({ driver, icon, style }: GaugeProps) {
	const { theme } = useUnistyles();
	const inner = useRef(
		Skia.Path.Make().addArc(
			{
				width: WIDTH,
				height: HEIGHT,
				x: SIZE / 2,
				y: SIZE / 2,
			},
			135,
			270,
		),
	).current;

	const highlight = useDerivedValue(() => {
		const path = Skia.Path.Make();
		path.addArc(
			{
				width: WIDTH,
				height: HEIGHT,
				x: SIZE / 2,
				y: SIZE / 2,
			},
			135,
			270 * driver.progress.value,
		);
		return path;
	});

	const Icon = renderSlot(icon, {
		style: styles.icon,
		size: 29,
	});

	return (
		<View style={[styles.canvasContainer, style]}>
			<Canvas style={styles.canvas}>
				<Path
					style="stroke"
					strokeWidth={SIZE}
					strokeCap="round"
					path={inner}
					color={theme.surface.transparent}
				/>
				<Path
					style="stroke"
					strokeWidth={SIZE}
					strokeCap="round"
					path={highlight}
					color={theme.surface.primary}
				/>
			</Canvas>
			{Icon}
			<Text variant="body">{driver.text}</Text>
		</View>
	);
}

const styles = StyleSheet.create((theme) => ({
	canvas: {
		...StyleSheet.absoluteFillObject,
	},
	canvasContainer: {
		width: WIDTH + SIZE,
		height: HEIGHT + SIZE,
		alignItems: "center",
		justifyContent: "center",
	},
	icon: {
		position: "absolute",
		bottom: theme.gap(1),
	},
}));
