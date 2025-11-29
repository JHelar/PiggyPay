import type { UseQueryResult } from "@tanstack/react-query";
import type { Groups } from "@/api/group";

export type GroupsScreenProps = {
	query: UseQueryResult<Groups>;
};
