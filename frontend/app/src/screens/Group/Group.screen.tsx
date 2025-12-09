import { use } from "react";
import { View } from "react-native";
import { useScreenFocusSetTheme } from "@/hooks/useScreenFocusSetTheme";
import { Text } from "@/ui/components/Text";
import type { GroupScreenProps } from "./Group.types";

export function GroupScreen({ query }: GroupScreenProps) {
	const group = use(query.promise);

	useScreenFocusSetTheme(group.group_theme);

	return (
		<View>
			<Text variant="title">{group.group_name}</Text>
		</View>
	);
}
