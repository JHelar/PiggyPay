import type { ReactNode } from "react";
import type { UnistylesVariants } from "react-native-unistyles";
import type { Extendable } from "@/ui/ui.types";
import type { styles } from "./ScreenContent.styles";

export type ScreenContentProps = {
	children?: ReactNode;
} & Extendable &
	UnistylesVariants<typeof styles>;
