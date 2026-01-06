import type { PropsWithChildren } from "react";
import type { Extendable } from "@/ui/ui.types";
import type { RenderSlot } from "@/ui/utils/renderSlot";

export type CloudsProps = {
	front?: RenderSlot;
} & PropsWithChildren<Extendable>;
