import { useMemo } from "react";
import { Pressable } from "react-native";
import { renderSlot } from "@/ui/utils/renderSlot";
import { Spinner } from "../Spinner";
import { Text } from "../Text";
import { styles } from "./Button.styles";
import type { ButtonProps } from "./Button.types";

export function Button({
	onPress,
	children,
	variant = "filled",
	style: containerStyles,
	icon,
	loading = false,
	...a11yProps
}: ButtonProps) {
	styles.useVariants({ variant });

	const Icon = renderSlot(icon, {
		style: styles.icon,
	});

	const Content = useMemo(() => {
		if (loading) return <Spinner />;

		return (
			<>
				{Icon}
				<Text style={styles.text} variant="body">
					{children}
				</Text>
			</>
		);
	}, [Icon, children, loading]);

	return (
		<Pressable
			onPress={onPress}
			style={[styles.container, containerStyles]}
			disabled={loading}
			accessibilityRole="button"
			accessibilityState={{
				disabled: loading,
			}}
			{...a11yProps}
		>
			{Content}
		</Pressable>
	);
}
