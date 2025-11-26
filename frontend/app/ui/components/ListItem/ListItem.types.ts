import type { A11YProps, Extendable, PressableComponent } from "@/ui/ui.types";
import type { RenderSlot } from "@/ui/utils/renderSlot";

export type ListItemProps = {
	middle?: RenderSlot<Extendable>;
	left?: RenderSlot<Extendable>;
	right?: RenderSlot<Extendable>;
} & PressableComponent &
	A11YProps;
