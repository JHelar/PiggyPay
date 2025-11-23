import { useQuery } from "@tanstack/react-query";
import { getGroups } from "@/api/group";
import { GroupsScreen } from "@/screens/Groups";

export default function Groups() {
	const query = useQuery(getGroups());

	return <GroupsScreen query={query} />;
}
