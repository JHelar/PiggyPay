import { use } from "react";
import { StyleSheet } from "react-native-unistyles";
import { Text } from "@/ui/components/Text";
import type { GroupsScreenProps } from "./Groups.types";

export function GroupsScreen({ query }: GroupsScreenProps) {
	const groups = use(query.promise);
	const hasGroups = groups.length > 0;

	if (hasGroups) {
		return <Text variant="title">You have groups</Text>;
	}

	return <Text variant="title">No groups</Text>;
}

const styles = StyleSheet.create(() => ({
	container: {},
}));
