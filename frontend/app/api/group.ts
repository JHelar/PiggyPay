import { queryOptions } from "@tanstack/react-query";
import z from "zod";
import { fetchJSON } from "@/query/fetch";

export const Group = z.object({
	id: z.number(),
	group_name: z.string(),
	group_state: z.string(),
	group_theme: z.string(),
	created_at: z.coerce.date(),
	updated_at: z.coerce.date(),
	total_expenses: z.number(),
});

export type Group = z.output<typeof Group>;

export const Groups = z.array(Group);
export type Groups = z.output<typeof Groups>;

export function getGroups() {
	return queryOptions({
		queryKey: ["groups"],
		async queryFn() {
			return await fetchJSON("groups", {
				method: "GET",
				output: Groups,
			});
		},
	});
}
