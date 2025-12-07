import { useRoute } from "@react-navigation/native";
import { useQuery } from "@tanstack/react-query";
import { getGroup } from "@/api/group";
import type { EditGroupRouteParams } from "@/screens/EditGroup/EditGroup.route";
import { EditGroupScreen } from "@/screens/EditGroup/EditGroup.screen";

export default function EditGroup() {
	const router = useRoute();
	const { groupId } = router.params as EditGroupRouteParams;
	const query = useQuery(getGroup(groupId));

	return <EditGroupScreen query={query} />;
}
