import { View } from "react-native";
import { styles } from "./ScreenContent.styles";
import type { ScreenContentProps } from "./ScreenContent.types";

export function ScreenContent({
	children,
	containerStyles,
	variant,
}: ScreenContentProps) {
	styles.useVariants({ variant });
	return <View style={[styles.container, containerStyles]}>{children}</View>;
}
