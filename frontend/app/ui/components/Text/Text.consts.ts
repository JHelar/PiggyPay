import type { AccessibilityRole } from "react-native";
import type { TextVariants } from "./Text.types";

export const TextAccessibilityRole: Partial<
	Record<NonNullable<TextVariants["variant"]>, AccessibilityRole>
> = {
	headline: "header",
	title: "header",
};
