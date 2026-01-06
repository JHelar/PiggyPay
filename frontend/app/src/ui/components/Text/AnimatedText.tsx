import { TextInput } from "react-native";
import Animated, { useAnimatedProps } from "react-native-reanimated";
import { TextAccessibilityRole } from "./Text.consts";
import { styles } from "./Text.styles";
import type { AnimatedTextProps } from "./Text.types";

const AnimatedTextInput = Animated.createAnimatedComponent(TextInput);

export function AnimatedText({
	children,
	style,
	variant = "body",
}: AnimatedTextProps) {
	styles.useVariants({ variant });

	const animatedProps = useAnimatedProps(() => {
		return { text: children?.value ?? "", defaultValue: children?.value ?? "" };
	});

	return (
		<AnimatedTextInput
			animatedProps={animatedProps}
			style={style}
			accessibilityRole={TextAccessibilityRole[variant]}
			editable={false}
		/>
	);
}
