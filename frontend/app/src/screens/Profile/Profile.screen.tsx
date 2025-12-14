import { Trans, useLingui } from "@lingui/react/macro";
import { useMutation } from "@tanstack/react-query";
import { use, useCallback } from "react";
import { View } from "react-native";
import { StyleSheet } from "react-native-unistyles";
import { deleteUser, signOut } from "@/api/user";
import { Alert } from "@/components/AlertRoot";
import { Button } from "@/ui/components/Button";
import { DataRow } from "@/ui/components/DataRow";
import { Icon } from "@/ui/components/Icon";
import type { ProfileScreenProps } from "./Profile.types";

export function ProfileScreen({ query }: ProfileScreenProps) {
	const user = use(query.promise);
	const { t } = useLingui();
	const { mutate: signOutMutation } = useMutation(signOut());
	const { mutate: deleteUserMutation } = useMutation(deleteUser());

	const onDelete = useCallback(async () => {
		const result = await Alert.destructive({
			title: t`Delete account?`,
			body: t`You will be removed from any ongoing and archived groups, all expenses you have made will also be removed.`,
			primaryText: t`Delete`,
			cancelText: t`Cancel`,
		});
		if (result === "success") {
			deleteUserMutation();
		}
	}, [deleteUserMutation, t]);

	return (
		<View style={styles.container}>
			<Icon
				name="initials"
				firstName={user.first_name}
				lastName={user.last_name}
				size={170}
				style={styles.icon}
			/>
			<View style={styles.content}>
				<DataRow label={t`First name`} data={user.first_name} />
				<DataRow label={t`Last name`} data={user.last_name} />
				<DataRow label={t`Email`} data={user.email} />
				<DataRow label={t`Phone number`} data={user.phone_number} />
			</View>
			<View style={styles.buttons}>
				<Button
					variant="filled"
					onPress={signOutMutation}
					icon={<Icon name="logout" />}
				>
					<Trans>Sign out</Trans>
				</Button>
				<Button
					variant="destructive"
					onPress={onDelete}
					icon={<Icon name="delete-outline" />}
				>
					<Trans>Delete account</Trans>
				</Button>
			</View>
		</View>
	);
}

const styles = StyleSheet.create((theme) => ({
	buttons: {
		flex: 1,
		justifyContent: "flex-end",
		rowGap: theme.gap(2),
	},
	container: {
		rowGap: theme.gap(4),
		flex: 1,
	},
	content: {
		rowGap: theme.gap(2),
	},
	icon: {
		alignSelf: "center",
	},
}));
