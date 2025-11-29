import type { UseQueryResult } from "@tanstack/react-query";
import type { Group } from "@/api/group";

export type GroupScreenProps = {
	query: UseQueryResult<Group>;
};
