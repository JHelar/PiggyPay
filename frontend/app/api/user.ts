import { mutationOptions } from "@tanstack/react-query";
import z from "zod";
import { fetchJSON } from "@/query/fetch";

export function signIn() {
	return mutationOptions({
		async mutationFn(mutationArgs: { email: string }) {
			await fetchJSON("user/signIn", {
				body: JSON.stringify(mutationArgs),
				method: "POST",
			});
		},
	});
}

export function verifyCode() {
	return mutationOptions({
		async mutationFn({ email, code }: { email: string; code: number }) {
			return await fetchJSON("user/signIn", {
				method: "GET",
				output: z.object({
					session: z.string(),
					new_user: z.boolean(),
				}),
				query: {
					email,
					code: code.toString(),
				},
			});
		},
	});
}
