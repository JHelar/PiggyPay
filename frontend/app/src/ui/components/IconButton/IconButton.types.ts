import type { ViewStyle } from "react-native";
import type { A11YProps, Extendable, PressableComponent } from "@/ui/ui.types";
import type { PartialRequired } from "@/ui/utils/typeUtils";
import type { IconProps } from "../Icon/Icon.types";

export type IconButtonProps = IconProps &
	PressableComponent &
	Extendable<ViewStyle> &
	PartialRequired<A11YProps, "accessibilityLabel">;
