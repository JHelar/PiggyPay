import AntDesign from "@expo/vector-icons/AntDesign";
import { View, type ViewStyle } from "react-native";
import { StyleSheet } from "react-native-unistyles";
import { Text } from "../Text";
import { DEFAULT_ICON_SIZE } from "./Icon.consts";
import type { IconProps } from "./Icon.types";

export function Icon({
	containerStyles,
	size = DEFAULT_ICON_SIZE,
	...props
}: IconProps) {
	if (props.name === "initials") {
		return (
			<View
				{...props}
				style={[styles.initials, containerStyles as ViewStyle]}
				accessibilityLabel={`${props.firstName} ${props.lastName}`}
			>
				<Text
					variant="xsmall"
					importantForAccessibility="no"
					accessibilityElementsHidden
				>
					{`${props.firstName.at(0)}${props.lastName.at(0)}`.toLocaleUpperCase()}
				</Text>
			</View>
		);
	}
	return <AntDesign style={containerStyles} size={size} {...props} />;
}

const styles = StyleSheet.create((theme) => ({
	initials: {
		width: 30,
		height: 30,
		borderRadius: 30,
		backgroundColor: theme.background.surface,
		alignItems: "center",
		justifyContent: "center",
	},
}));
