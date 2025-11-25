import { use } from "react";
import { View } from "react-native";
import { StyleSheet } from "react-native-unistyles";
import { ListItem } from "@/ui/components/ListItem";
import { Text } from "@/ui/components/Text";
import type { GroupsScreenProps } from "./Groups.types";

export function GroupsScreen({ query }: GroupsScreenProps) {
	const groups = use(query.promise);
	const hasGroups = groups.length > 0;

	if (hasGroups) {
		return (
			<View>
				{groups.map((group) => (
					<ListItem
						key={group.id}
						middle={<Text variant="body">{group.group_name}</Text>}
						right={<Text variant="body">{group.total_expenses}</Text>}
					/>
				))}
			</View>
		);
	}

	return <Text variant="title">No groups</Text>;
}

const styles = StyleSheet.create(() => ({
	container: {},
}));
