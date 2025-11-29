import { useRoute } from "@react-navigation/native";
import { useQuery } from "@tanstack/react-query";
import type { RouteParams } from "expo-router";
import { getGroup } from "@/api/group";
import { GroupScreen } from "@/screens/Group";

type GroupRouteParams = RouteParams<"/(screens)/Groups/[groupId]">;

export default function Group() {
	const router = useRoute();
	const { groupId } = router.params as GroupRouteParams;
	const query = useQuery(getGroup(groupId));

	return <GroupScreen query={query} />;
}
