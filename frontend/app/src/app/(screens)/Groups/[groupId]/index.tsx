import { useRoute } from "@react-navigation/native";
import { useQuery } from "@tanstack/react-query";
import { getGroup } from "@/api/group";
import { GroupScreen } from "@/screens/Group";
import type { GroupRouteParams } from "@/screens/Group/Group.route";

export default function Group() {
	const router = useRoute();
	const { groupId } = router.params as GroupRouteParams;
	const query = useQuery(getGroup(groupId));

	return <GroupScreen query={query} />;
}
