import type { StyleProp, ViewStyle, AccessibilityProps } from "react-native";

export type A11YProps = {
	[K in keyof AccessibilityProps]: AccessibilityProps[K];
};

export type Extendable<Style = ViewStyle> = {
	containerStyles?: StyleProp<Style>;
};

export type PressableComponent = {
	onPress?(): void;
};
