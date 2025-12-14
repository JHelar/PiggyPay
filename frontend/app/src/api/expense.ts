import { i18n } from "@lingui/core";
import { msg } from "@lingui/core/macro";
import { mutationOptions } from "@tanstack/react-query";
import z from "zod";
import { Snackbar } from "@/components/SnackbarRoot";
import { fetchJSON, fetchRaw } from "@/query/fetch";

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
const createExpenseFailedTitle = msg`Failed to crate expense, something went wrong`;
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
		onError(error, variables, onMutateResult, context) {
			Snackbar.toast({
				text: i18n._(createExpenseFailedTitle),
			});
		},
	});
}

const updateExpenseSuccessTitle = msg`Expense updated`;
const updateExpenseFailedTitle = msg`Failed to update expense, something went wrong`;
type UpdateExpenseArguments = {
	groupId: string;
	expenseId: string;
	payload: UpsertExpense;
};
export function updateExpense() {
	return mutationOptions({
		async mutationFn({ groupId, expenseId, payload }: UpdateExpenseArguments) {
			return await fetchJSON(`groups/${groupId}/expense/${expenseId}`, {
				method: "PATCH",
				body: JSON.stringify(payload),
			});
		},
		onSuccess(data, variables, onMutateResult, context) {
			context.client.invalidateQueries({
				queryKey: ["groups"],
			});
			Snackbar.toast({
				text: i18n._(updateExpenseSuccessTitle),
			});
		},
		onError(error, variables, onMutateResult, context) {
			Snackbar.toast({
				text: i18n._(updateExpenseFailedTitle),
			});
		},
	});
}

const deleteExpenseSuccessTitle = msg`Expense deleted`;
const deleteExpenseFailedTitle = msg`Failed to delete expense, something went wrong`;
type DeleteExpenseArguments = {
	groupId: number;
	expenseId: number;
};
export function deleteExpense() {
	return mutationOptions({
		async mutationFn({ groupId, expenseId }: DeleteExpenseArguments) {
			return await fetchRaw(`groups/${groupId}/expense/${expenseId}`, {
				method: "DELETE",
			});
		},
		onSuccess(data, variables, onMutateResult, context) {
			context.client.invalidateQueries({
				queryKey: ["groups"],
			});
			Snackbar.toast({
				text: i18n._(deleteExpenseSuccessTitle),
			});
		},
		onError(error, variables, onMutateResult, context) {
			Snackbar.toast({
				text: i18n._(deleteExpenseFailedTitle),
			});
		},
	});
}
