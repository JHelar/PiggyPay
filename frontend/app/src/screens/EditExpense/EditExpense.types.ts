import type { UseQueryResult } from "@tanstack/react-query";
import type { Group } from "@/api/group";

export type EditExpenseScreenProps = {
	query: UseQueryResult<Group>;
};
