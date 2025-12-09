import { zodResolver } from "@hookform/resolvers/zod";
import { Trans, useLingui } from "@lingui/react/macro";
import { useMutation } from "@tanstack/react-query";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useForm } from "react-hook-form";
import { View } from "react-native";
import { StyleSheet } from "react-native-unistyles";
import { createExpense, UpsertExpense } from "@/api/expense";
import { Snackbar } from "@/components/SnackbarRoot";
import { useScreenOptionsEffect } from "@/hooks/useScreenOptionsEffect";
import { Button } from "@/ui/components/Button";
import { FormField } from "@/ui/components/FormField";
import { TextInput } from "@/ui/components/TextInput";
import type { NewExpenseRouteParams } from "./NewExpense.route";

export function NewExpenseScreen() {
	const { t } = useLingui();
	const router = useRouter();
	const { groupId } = useLocalSearchParams<NewExpenseRouteParams>();
	const { mutateAsync, isPending } = useMutation(createExpense());
	const form = useForm({
		resolver: zodResolver(UpsertExpense),
	});

	const onSubmit = form.handleSubmit(async (data) => {
		try {
			await mutateAsync({
				groupId,
				payload: data,
			});
		} catch (error) {
			console.error(error);
			Snackbar.toast({
				text: t`Failed to crate expense, something went wrong`,
			});
		} finally {
			router.back();
		}
	});

	useScreenOptionsEffect({
		headerRight() {
			return (
				<Button variant="ghost" onPress={onSubmit} loading={isPending}>
					<Trans>Done</Trans>
				</Button>
			);
		},
	});

	return (
		<View style={styles.container}>
			<FormField
				control={form.control}
				label={t`Expense name`}
				name="expense_name"
				input={<TextInput autoCapitalize="words" keyboardType="default" />}
			/>
			<FormField
				control={form.control}
				label={t`Cost`}
				name="expense_cost"
				input={<TextInput keyboardType="numbers-and-punctuation" />}
			/>
		</View>
	);
}

const styles = StyleSheet.create((theme) => ({
	container: {
		rowGap: theme.gap(2),
	},
}));
