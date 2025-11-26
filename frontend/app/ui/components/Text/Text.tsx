import { Text as RNText } from "react-native";
import { TextAccessibilityRole } from "./Text.consts";
import { styles } from "./Text.styles";
import type { TextProps } from "./Text.types";

export function Text({
	children,
	style: containerStyles,
	variant = "body",
}: TextProps) {
	styles.useVariants({ variant });

	return (
		<RNText
			style={[styles.text, containerStyles]}
			accessibilityRole={TextAccessibilityRole[variant]}
		>
			{children}
		</RNText>
	);
}
