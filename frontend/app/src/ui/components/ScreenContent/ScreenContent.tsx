import { View } from "react-native";
import { renderSlot } from "@/ui/utils/renderSlot";
import { styles } from "./ScreenContent.styles";
import type { ScreenContentProps } from "./ScreenContent.types";

export function ScreenContent({
	children,
	style: containerStyles,
	variant,
	footer,
}: ScreenContentProps) {
	styles.useVariants({ variant });

	const Footer = renderSlot(footer, { style: styles.footer });

	return (
		<View style={[styles.container, containerStyles]}>
			{children}
			{Footer}
		</View>
	);
}
