import { mutationOptions, queryOptions } from "@tanstack/react-query";
import z from "zod";
import { fetchJSON } from "@/query/fetch";

export const User = z.object({
	first_name: z.string(),
	last_name: z.string(),
	phone_number: z.string(),
	email: z.string(),
});
export type User = z.output<typeof User>;

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

type VerifyUserArguments = { email: string; code: number };
export function verifyCode() {
	return mutationOptions({
		async mutationFn({ email, code }: VerifyUserArguments) {
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

export function getUser() {
	return queryOptions({
		queryKey: ["user"],
		async queryFn() {
			return await fetchJSON("user/me", {
				method: "GET",
				output: User,
			});
		},
	});
}

type CreateUserArguments = {
	first_name: string;
	last_name: string;
	phone_number: string;
};
export function createUser() {
	return mutationOptions({
		mutationKey: ["user"],
		async mutationFn(createUserArgs: CreateUserArguments) {
			return await fetchJSON("user/create", {
				method: "POST",
				output: User,
				body: JSON.stringify(createUserArgs),
			});
		},
	});
}
