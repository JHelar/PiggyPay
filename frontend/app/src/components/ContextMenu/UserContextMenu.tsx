import { useLingui } from "@lingui/react/macro";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import { getUser, signOut } from "@/api/user";
import { ContextMenu } from "@/components/ContextMenu";
import { IconButton } from "@/ui/components/IconButton";

export function UserContextMenu() {
	const { data } = useQuery(getUser());
	const { mutate: signOutMutation } = useMutation(signOut());
	const { t } = useLingui();
	const router = useRouter();

	if (data === undefined) return;

	return (
		<ContextMenu
			actions={[
				{
					icon: "user",
					title: `${data.first_name} ${data.last_name}`,
					onPress: () => router.navigate("/(screens)/User"),
				},
				{
					icon: "edit",
					title: t`Edit profile`,
					onPress: () => router.navigate("/(modals)/User/Edit"),
				},
				{
					icon: "signOut",
					title: t`Sign out`,
					onPress: signOutMutation,
				},
			]}
			trigger={
				<IconButton
					name="initials"
					accessibilityLabel={t`Open menu`}
					firstName={data.first_name}
					lastName={data.last_name}
				/>
			}
		/>
	);
}
