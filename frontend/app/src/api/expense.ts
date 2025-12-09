import { i18n } from "@lingui/core";
import { msg } from "@lingui/core/macro";
import { mutationOptions } from "@tanstack/react-query";
import z from "zod";
import { Snackbar } from "@/components/SnackbarRoot";
import { fetchJSON } from "@/query/fetch";

export const UpsertExpense = z.object({
	expense_name: z.string(),
	expense_cost: z.coerce.number(),
});

export type UpsertExpense = z.infer<typeof UpsertExpense>;

export const Expense = z.object({
	id: z.number(),
	name: z.string(),
	cost: z.number(),
	first_name: z.string(),
	last_name: z.string(),
});

export type Expense = z.infer<typeof Expense>;

type CreateExpenseArguments = {
	groupId: string;
	payload: UpsertExpense;
};

const createExpenseSuccessTitle = msg`Expense created`;
export function createExpense() {
	return mutationOptions({
		async mutationFn({ groupId, payload }: CreateExpenseArguments) {
			return await fetchJSON(`groups/${groupId}/expense`, {
				method: "POST",
				output: Expense,
				body: JSON.stringify(payload),
			});
		},
		onSuccess(data, variables, onMutateResult, context) {
			context.client.invalidateQueries({
				queryKey: ["groups"],
			});
			Snackbar.toast({
				text: i18n._(createExpenseSuccessTitle),
			});
		},
	});
}
