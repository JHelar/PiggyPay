import { useQuery } from "@tanstack/react-query";
import { getUser } from "@/api/user";
import { ProfileScreen } from "@/screens/Profile";

export default function Profile() {
	const query = useQuery(getUser());
	return <ProfileScreen query={query} />;
}
