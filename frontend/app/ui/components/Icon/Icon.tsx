import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { View, type ViewStyle } from "react-native";
import { StyleSheet } from "react-native-unistyles";
import { Text } from "../Text";
import {
	DEFAULT_ICON_INITIALS_SIZE,
	DEFAULT_ICON_SIZE,
	INITIALS_FONT_SIZE_MULTIPLIER,
} from "./Icon.consts";
import type { IconProps } from "./Icon.types";

export function Icon({ containerStyles, size, ...props }: IconProps) {
	if (props.name === "initials") {
		return (
			<View
				{...props}
				style={[styles.initials(size), containerStyles as ViewStyle]}
				accessibilityLabel={`${props.firstName} ${props.lastName}`}
			>
				<Text
					variant="xsmall"
					importantForAccessibility="no"
					accessibilityElementsHidden
					containerStyles={styles.initialsText(size)}
				>
					{`${props.firstName.at(0)}${props.lastName.at(0)}`.toLocaleUpperCase()}
				</Text>
			</View>
		);
	}
	return (
		<MaterialIcons
			style={containerStyles}
			size={size ?? DEFAULT_ICON_SIZE}
			{...props}
		/>
	);
}

const styles = StyleSheet.create((theme) => ({
	initials(size = DEFAULT_ICON_INITIALS_SIZE) {
		return {
			width: size,
			height: size,
			borderRadius: size,
			backgroundColor: theme.background.secondary,
			alignItems: "center",
			justifyContent: "center",
			textAlign: "center",
		};
	},
	initialsText(size = DEFAULT_ICON_INITIALS_SIZE) {
		return {
			fontSize: size * INITIALS_FONT_SIZE_MULTIPLIER,
			lineHeight: size * INITIALS_FONT_SIZE_MULTIPLIER,
			color: theme.text.color.accent,
		};
	},
}));
