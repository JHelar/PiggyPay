import AntDesign from "@expo/vector-icons/AntDesign";
import { Icon } from "../Icon/Icon";
import { DEFAULT_ICON_SIZE } from "../Icon/Icon.consts";
import type { IconButtonProps } from "./IconButton.types";

export function IconButton({
	size = DEFAULT_ICON_SIZE,
	...props
}: IconButtonProps) {
	if (props.name === "initials") {
		return <Icon size={size} {...props} />;
	}
	return <AntDesign.Button size={size} {...props} />;
}
