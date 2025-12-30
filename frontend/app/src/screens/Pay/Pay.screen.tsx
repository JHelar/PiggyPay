import { use } from "react";
import { TransactionState } from "@/api/transaction";
import { ProgressStepper } from "@/ui/components/ProgressStepper";
import type { PayScreenProps } from "./Pay.types";

export function PayScreen({ query }: PayScreenProps) {
	const transactions = use(query.promise);

	const paidTransactions = transactions.filter(
		({ transaction_state }) => transaction_state === TransactionState.enum.Paid,
	).length;
	const totalTransactions = transactions.length;

	console.log(transactions);

	return (
		<>
			<ProgressStepper
				currentStep={paidTransactions}
				totalSteps={totalTransactions}
			/>
		</>
	);
}
