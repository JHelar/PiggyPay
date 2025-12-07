import { zodResolver } from "@hookform/resolvers/zod";
import { Trans, useLingui } from "@lingui/react/macro";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import { use } from "react";
import { useForm } from "react-hook-form";
import { View } from "react-native";
import { StyleSheet } from "react-native-unistyles";
import { UpsertGroup, updateGroup } from "@/api/group";
import { ColorThemePicker } from "@/components/ColorThemePicker";
import { Snackbar } from "@/components/SnackbarRoot";
import { useScreenOptionsEffect } from "@/hooks/useScreenOptionsEffect";
import { Button } from "@/ui/components/Button";
import { FormField } from "@/ui/components/FormField";
import { TextInput } from "@/ui/components/TextInput";
import type { EditGroupScreenProps } from "./EditGroup.types";

export function EditGroupScreen({ query }: EditGroupScreenProps) {
	const group = use(query.promise);
	const { mutateAsync, isPending } = useMutation(updateGroup());
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
			await mutateAsync({
				groupId: group.id,
				payload: updateData,
			});
		} catch (error) {
			console.error(error);
			Snackbar.toast({
				text: t`Update failed, something went wrong`,
			});
		} finally {
			router.back();
		}
	});

	useScreenOptionsEffect({
		headerRight() {
			return (
				<Button variant="ghost" onPress={onSubmit} loading={isPending}>
					<Trans>Save</Trans>
				</Button>
			);
		},
	});

	return (
		<View style={styles.container}>
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
	);
}

const styles = StyleSheet.create((theme) => ({
	container: {
		rowGap: theme.gap(2),
	},
}));
