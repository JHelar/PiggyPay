import { i18n } from "@lingui/core";
import { msg } from "@lingui/core/macro";
import { mutationOptions, queryOptions } from "@tanstack/react-query";
import z from "zod";
import { Snackbar } from "@/components/SnackbarRoot";
import { fetchJSON, fetchRaw } from "@/query/fetch";

export const TransactionState = z.enum({
	Unpaid: "transaction_state:unpaid",
	Paid: "transaction_state:Paid",
});

export type TransactionState = z.infer<typeof TransactionState>;

export const Transaction = z.object({
	from_receipt_id: z.number(),
	to_receipt_id: z.number(),
	transaction_id: z.number(),
	transaction_state: TransactionState,
	transaction_amount: z.number(),
	to_first_name: z.string(),
	to_last_name: z.string(),
	to_phone_number: z.string(),
});
export type Transaction = z.infer<typeof Transaction>;

export const Transactions = z.array(Transaction);
export type Transactions = z.infer<typeof Transactions>;

export function getTransactions(groupId: string) {
	return queryOptions({
		queryKey: ["transactions"],
		async queryFn() {
			return fetchJSON(`groups/${groupId}/transaction`, {
				method: "GET",
				output: Transactions,
			});
		},
	});
}

type PayTransactionArguments = {
	transactionId: string;
	groupId: string;
};

const payTransactionFailedTitle = msg`Failed to pay transaction, try again later`;

export function payTransaction() {
	return mutationOptions({
		async mutationFn({ transactionId, groupId }: PayTransactionArguments) {
			return await fetchRaw(
				`groups/${groupId}/transaction/${transactionId}/pay`,
				{
					method: "PATCH",
				},
			);
		},
		async onSuccess(data, variables, onMutateResult, context) {
			await context.client.invalidateQueries({
				queryKey: ["transactions"],
			});
			await context.client.invalidateQueries({
				queryKey: ["groups", { id: variables.groupId }],
			});
		},
		onError(error, variables, onMutateResult, context) {
			Snackbar.toast({
				text: i18n._(payTransactionFailedTitle),
			});
		},
	});
}
