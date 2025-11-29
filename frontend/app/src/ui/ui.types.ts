import type { AccessibilityProps, StyleProp, ViewStyle } from "react-native";

export type A11YProps = {
	[K in keyof AccessibilityProps]: AccessibilityProps[K];
};

export type Extendable<Style = ViewStyle> = {
	style?: StyleProp<Style>;
};

export type PressableComponent = {
	onPress?(): void;
};
