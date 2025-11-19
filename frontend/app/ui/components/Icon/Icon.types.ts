import type AntDesign from "@expo/vector-icons/AntDesign";
import type { ComponentProps } from "react";
import type { TextStyle } from "react-native";
import type { A11YProps, Extendable } from "@/ui/ui.types";

type IconName = ComponentProps<typeof AntDesign>["name"];

export type IconProps = {
	size?: number;
} & (
	| {
			name: IconName;
	  }
	| {
			name: "initials";
			firstName: string;
			lastName: string;
	  }
) &
	Extendable<TextStyle> &
	A11YProps;
