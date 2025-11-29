import { use } from "react";
import { View } from "react-native";
import { Text } from "@/ui/components/Text";
import type { GroupScreenProps } from "./Group.types";

export function GroupScreen({ query }: GroupScreenProps) {
	const group = use(query.promise);

	return (
		<View>
			<Text variant="title">{group.group_name}</Text>
		</View>
	);
}
