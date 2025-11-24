import type { Extendable } from "@/ui/ui.types";
import type { RenderSlot } from "@/ui/utils/renderSlot";
import type { ButtonProps } from "../Button";

export type ScreenContentFooterProps = {
	primary?: RenderSlot<ButtonProps>;
	secondary?: RenderSlot<ButtonProps>;
} & Extendable;
