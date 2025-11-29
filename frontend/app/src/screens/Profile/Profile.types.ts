import type { UseQueryResult } from "@tanstack/react-query";
import type { User } from "@/api/user";

export type ProfileScreenProps = {
	query: UseQueryResult<User>;
};
