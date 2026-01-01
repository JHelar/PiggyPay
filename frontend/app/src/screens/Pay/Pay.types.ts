import type { UseQueryResult } from "@tanstack/react-query";
import type { Transaction, Transactions } from "@/api/transaction";

export type TransactionViewProps = {
	transaction: Transaction;
	onPay(): void;
	paying: boolean;
};

export type PayScreenProps = {
	query: UseQueryResult<Transactions>;
	groupId: string;
};
