import type { UseQueryResult } from "@tanstack/react-query";
import type { Transactions } from "@/api/transaction";

export type PayScreenProps = {
	query: UseQueryResult<Transactions>;
};
