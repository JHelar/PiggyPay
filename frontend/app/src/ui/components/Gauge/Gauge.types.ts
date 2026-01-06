import type { SharedValue } from "react-native-reanimated";
import type { Extendable } from "@/ui/ui.types";
import type { RenderSlot } from "@/ui/utils/renderSlot";
import type { IconProps } from "../Icon";

export type GaugeProps = {
	driver: GaugeDriver;
	icon?: RenderSlot<IconProps>;
} & Extendable;

export type UseGaugeDriverArguments = {
	minValue: number;
	maxValue: number;
	currentValue: number;
	format(currentValue: number, minValue: number, maxValue: number): string;
};

export type GaugeDriver = {
	progress: SharedValue<number>;
	text: SharedValue<string>;
};
