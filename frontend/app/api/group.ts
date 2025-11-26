import { i18n } from "@lingui/core";
import { msg } from "@lingui/core/macro";
import { mutationOptions, queryOptions } from "@tanstack/react-query";
import z from "zod";
import { Snackbar } from "@/components/SnackbarRoot";
import { queryClient } from "@/query";
import { fetchJSON } from "@/query/fetch";

export const Member = z.object({
	first_name: z.string(),
	last_name: z.string(),
	member_id: z.int(),
	member_role: z.string(),
});
export type Member = z.output<typeof Member>;

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

export const GroupWithMembers = Group.and(
	z.object({
		members: z.array(Member),
	}),
);
export type GroupWithMembers = z.output<typeof GroupWithMembers>;

export const Groups = z.array(GroupWithMembers);
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

export const ColorTheme = z.enum({
	Blue: "color_theme:blue",
	Green: "color_theme:green",
});
export type ColorTheme = z.output<typeof ColorTheme>;

export const CreateGroup = z.object({
	display_name: z.string(),
	color_theme: ColorTheme,
});
export type CreateGroup = z.output<typeof CreateGroup>;

const createGroupSuccessTitle = msg`Group crated`;
export function createGroup() {
	return mutationOptions({
		async mutationFn(group: CreateGroup) {
			return await fetchJSON("groups", {
				method: "POST",
				output: z.object({
					group_id: z.number(),
					color_theme: ColorTheme,
				}),
				body: JSON.stringify(group),
			});
		},
		onSuccess() {
			Snackbar.toast({
				text: i18n._(createGroupSuccessTitle),
			});
			queryClient.invalidateQueries({
				queryKey: ["groups"],
			});
		},
	});
}
