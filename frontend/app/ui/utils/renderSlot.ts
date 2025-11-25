import { cloneElement, isValidElement, type ReactNode } from "react";
import { StyleSheet } from "react-native-unistyles";
import { isDefined } from "@/utils/isDefined";
import type { Extendable } from "../ui.types";

export type RenderSlot<Props = {}> =
	| boolean
	| React.ReactElement<Props>
	| null
	| undefined;

const EXTENDABLE_STYLE_PROP: keyof Extendable = "containerStyles";

function mergeStyleProps<Props extends Record<string, unknown>>(
	slotProps: Props,
	propsOverride?: Partial<Props>,
) {
	if (propsOverride === undefined) return propsOverride;

	if (
		EXTENDABLE_STYLE_PROP in slotProps &&
		EXTENDABLE_STYLE_PROP in propsOverride
	) {
		return {
			...propsOverride,
			[EXTENDABLE_STYLE_PROP]: StyleSheet.flatten([
				slotProps[EXTENDABLE_STYLE_PROP],
				propsOverride[EXTENDABLE_STYLE_PROP],
			]),
		};
	}
	return propsOverride;
}

export function renderSlot<Props extends Record<string, unknown>>(
	slot?: RenderSlot<Props>,
	propsOverride?: Partial<Props>,
): ReactNode {
	if (!isDefined(slot)) return null;
	if (!isValidElement(slot)) return null;
	if (propsOverride === undefined) return slot;
	return cloneElement(slot, mergeStyleProps(slot.props, propsOverride));
}
