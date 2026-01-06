import { Text as RNText } from "react-native";
import { isSharedValue } from "react-native-reanimated";
import { AnimatedText } from "./AnimatedText";
import { TextAccessibilityRole } from "./Text.consts";
import { styles } from "./Text.styles";
import type { TextProps } from "./Text.types";

export function Text({
	children,
	style,
	variant = "body",
	...a11yProps
}: TextProps) {
	styles.useVariants({ variant });

	if (isSharedValue<string>(children)) {
		return (
			<AnimatedText
				style={[styles.text, style]}
				accessibilityRole={TextAccessibilityRole[variant]}
				{...a11yProps}
			>
				{children}
			</AnimatedText>
		);
	}

	return (
		<RNText
			style={[styles.text, style]}
			accessibilityRole={TextAccessibilityRole[variant]}
			{...a11yProps}
		>
			{children}
		</RNText>
	);
}
