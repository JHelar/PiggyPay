import { useQuery } from "@tanstack/react-query";
import { getUser } from "@/api/user";
import { useScreenOptionsEffect } from "@/hooks/useScreenOptionsEffect";
import {
	EditProfileRouteOptions,
	EditProfileScreen,
} from "@/screens/EditProfile";

export default function EditProfile() {
	const query = useQuery(getUser());
	useScreenOptionsEffect(EditProfileRouteOptions);

	return <EditProfileScreen query={query} />;
}
