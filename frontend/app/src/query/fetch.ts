import type z from "zod";
import { getAccessToken } from "@/auth/auth.store";
import { NetworkError } from "@/components/ErrorBoundary";

const BASE_URL = "http://127.0.0.1:8080";
const API_PATH = "api/v1";

type FetchOptions = {
	headers?: Record<string, string>;
	query?: Record<string, string>;
	method: "GET" | "POST" | "PATCH" | "DELETE";
} & Omit<NonNullable<Parameters<typeof fetch>[1]>, "headers">;

type FetchJSONOptions<Output extends z.ZodType | undefined> = FetchOptions & {
	output?: Output;
};

export async function fetchRaw(path: string, options: FetchOptions) {
	const fullPath = `${API_PATH}/${path}`;
	const url = new URL(fullPath, BASE_URL);

	if (options.query) {
		Object.entries(options.query).forEach(([key, value]) =>
			url.searchParams.append(key, value),
		);
	}

	const accessToken = getAccessToken();
	if (accessToken) {
		options.headers ??= {};
		options.headers["Authorization"] = `Bearer ${accessToken}`;
	}

	const response = await fetch(url, options);
	if (!response.ok) {
		throw new NetworkError(
			response.status,
			new Error(`[Fetch] path(${path}) with message "${response.statusText}"`),
		);
	}

	return response;
}

export async function fetchJSON<
	Output extends z.ZodType | undefined = undefined,
	Return = Output extends z.ZodType ? z.output<Output> : string,
>(
	path: string,
	{ output, ...options }: FetchJSONOptions<Output>,
): Promise<Return> {
	const headers = {
		...options.headers,
		"Content-Type": "application/json",
	};

	const response = await fetchRaw(path, {
		...options,
		headers,
	});

	if (output === undefined) return response.text() as Return;
	const json = await response.json();
	return output.parse(json) as Return;
}
