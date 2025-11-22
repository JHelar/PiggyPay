import { useQuery } from "@tanstack/react-query";
import { getUser } from "@/api/user";
import { EditProfileScreen } from "@/screens/EditProfile";

export default function EditProfile() {
	const query = useQuery(getUser());
	return <EditProfileScreen query={query} />;
}
