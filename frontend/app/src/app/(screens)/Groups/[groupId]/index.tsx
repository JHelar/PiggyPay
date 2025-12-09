import { useQuery } from "@tanstack/react-query";
import { useLocalSearchParams } from "expo-router";
import { getGroup } from "@/api/group";
import { GroupScreen } from "@/screens/Group";
import type { GroupRouteParams } from "@/screens/Group/Group.route";

export default function Group() {
	const { groupId } = useLocalSearchParams<GroupRouteParams>();
	const query = useQuery(getGroup(groupId));

	return <GroupScreen query={query} />;
}
