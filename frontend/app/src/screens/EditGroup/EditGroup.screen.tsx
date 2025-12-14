import { zodResolver } from "@hookform/resolvers/zod";
import { Trans, useLingui } from "@lingui/react/macro";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import { use, useCallback } from "react";
import { useForm } from "react-hook-form";
import { View } from "react-native";
import { StyleSheet } from "react-native-unistyles";
import { deleteGroup, UpsertGroup, updateGroup } from "@/api/group";
import { Alert } from "@/components/AlertRoot";
import { ColorThemePicker } from "@/components/ColorThemePicker";
import { useScreenOptionsEffect } from "@/hooks/useScreenOptionsEffect";
import { Button } from "@/ui/components/Button";
import { FormField } from "@/ui/components/FormField";
import { Icon } from "@/ui/components/Icon";
import { TextInput } from "@/ui/components/TextInput";
import type { EditGroupScreenProps } from "./EditGroup.types";

export function EditGroupScreen({ query }: EditGroupScreenProps) {
	const group = use(query.promise);
	const { mutateAsync: updateGroupMutation, isPending: isUpdating } =
		useMutation(updateGroup());
	const { mutateAsync: deleteGroupMutation, isPending: isDeleting } =
		useMutation(deleteGroup());
	const { t } = useLingui();
	const router = useRouter();

	const form = useForm({
		resolver: zodResolver(UpsertGroup),
		defaultValues: {
			color_theme: group.group_theme,
			display_name: group.group_name,
		},
	});

	const onSubmit = form.handleSubmit(async (updateData) => {
		try {
			await updateGroupMutation({
				groupId: group.id,
				payload: updateData,
			});
		} finally {
			router.back();
		}
	});

	useScreenOptionsEffect({
		headerRight() {
			return (
				<Button variant="ghost" onPress={onSubmit} loading={isUpdating}>
					<Trans>Done</Trans>
				</Button>
			);
		},
	});

	const onDelete = useCallback(async () => {
		const result = await Alert.destructive({
			title: t`Delete group?`,
			body: t`Are you sure you want to delete ${group.group_name}`,
			cancelText: t`Cancel`,
			primaryText: t`Delete`,
		});
		if (result === "success") {
			try {
				await deleteGroupMutation(group.id);
			} finally {
				router.replace("/(screens)/Groups");
			}
		}
	}, [group.group_name, t, deleteGroupMutation, group.id, router.dismissAll]);

	return (
		<View style={styles.container}>
			<View style={styles.content}>
				<FormField
					control={form.control}
					label={t`Group name`}
					name="display_name"
					input={<TextInput autoCapitalize="words" keyboardType="default" />}
				/>
				<FormField
					control={form.control}
					label={t`Color theme`}
					name="color_theme"
					input={<ColorThemePicker />}
				/>
			</View>
			<Button
				variant="destructive"
				onPress={onDelete}
				icon={<Icon name="delete-outline" />}
				loading={isDeleting}
			>
				<Trans>Delete group</Trans>
			</Button>
		</View>
	);
}

const styles = StyleSheet.create((theme) => ({
	container: {
		rowGap: theme.gap(2),
		flex: 1,
	},
	content: {
		rowGap: theme.gap(2),
	},
}));
