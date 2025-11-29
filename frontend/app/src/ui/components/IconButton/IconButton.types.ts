import type { A11YProps, PressableComponent } from "@/ui/ui.types";
import type { PartialRequired } from "@/ui/utils/typeUtils";
import type { IconProps } from "../Icon/Icon.types";

export type IconButtonProps = IconProps &
	PressableComponent &
	PartialRequired<A11YProps, "accessibilityLabel">;
