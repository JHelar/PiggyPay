import { Pressable } from "react-native";
import { Icon } from "../Icon/Icon";
import type { IconButtonProps } from "./IconButton.types";

export function IconButton({ onPress, ...props }: IconButtonProps) {
	return (
		<Pressable onPress={onPress} {...props}>
			<Icon {...props} />
		</Pressable>
	);
}
