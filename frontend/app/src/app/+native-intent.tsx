import type { NativeIntent } from "expo-router";
import { groupShareLinkId } from "@/utils/groupShareLink";

type RedirectSystemPathArguments = Parameters<
	NonNullable<NativeIntent["redirectSystemPath"]>
>[0];
export function redirectSystemPath({ path }: RedirectSystemPathArguments) {
	const parseResult = groupShareLinkId.safeParse(path);
	if (parseResult.success) {
		return `/(screens)/Groups/${parseResult.data}/Invite`;
	}
	return path;
}
