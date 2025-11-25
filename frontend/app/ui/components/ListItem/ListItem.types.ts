import type { Extendable } from "@/ui/ui.types";
import type { RenderSlot } from "@/ui/utils/renderSlot";

export type ListItemProps = {
	middle?: RenderSlot<Extendable>;
	left?: RenderSlot<Extendable>;
	right?: RenderSlot<Extendable>;
};
