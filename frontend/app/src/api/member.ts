import { i18n } from "@lingui/core";
import { mutationOptions } from "@tanstack/react-query";
import z from "zod";
import { Snackbar } from "@/components/SnackbarRoot";
import { fetchRaw } from "@/query/fetch";
import type { Group } from "./group";

export const MemberRole = z.enum(["member_role:admin", "member_role:regular"]);
export type MemberRole = z.infer<typeof MemberRole>;

export const MemberState = z.enum({
	Adding: "member_state:adding",
	Ready: "member_state:ready",
	Resolved: "member_state:resolved",
	Paying: "member_state:paying",
});
export type MemberState = z.infer<typeof MemberState>;

export const Member = z.object({
	first_name: z.string(),
	last_name: z.string(),
	member_id: z.int(),
	member_role: MemberRole,
});
export type Member = z.output<typeof Member>;

const memberReadyToPayError = "Unable to set state to ready to pay";
export function memberReadyToPay() {
	return mutationOptions({
		async mutationFn(groupId: string) {
			return fetchRaw(`groups/${groupId}/member/ready`, {
				method: "PATCH",
			});
		},
		onSuccess(data, groupId, onMutateResult, context) {
			context.client.setQueryData(
				["groups", { id: groupId }],
				(group: Group) =>
					({
						...group,
						member_state: MemberState.enum.Ready,
					}) satisfies Group,
			);
		},
		onError(error, variables, onMutateResult, context) {
			console.error(error);
			Snackbar.toast({
				text: i18n._(memberReadyToPayError),
			});
		},
	});
}
