import { cloneElement, isValidElement, type ReactNode } from "react";
import { isDefined } from "@/utils/isDefined";

export type RenderSlot<Props = {}> =
	| boolean
	| React.ReactElement<Props>
	| null
	| undefined;

export function renderSlot<Props>(
	slot?: RenderSlot<Props>,
	propsOverride?: Partial<Props>,
): ReactNode {
	if (!isDefined(slot)) return null;
	if (!isValidElement(slot)) return null;
	if (propsOverride === undefined) return slot;
	return cloneElement(slot, propsOverride);
}
