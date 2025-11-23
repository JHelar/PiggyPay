import { QueryClient } from "@tanstack/react-query";
import "./onlineManager";

import "@tanstack/react-query";
import { NetworkError } from "@/components/ErrorBoundary";

type QueryKey = ["user" | "groups", ...ReadonlyArray<unknown>];

const RETRY_DELAY = 1000 * 10;

function handleRetry(retryCount: number, error: Error) {
	if (error instanceof NetworkError) {
		if (error.statusCode === 401) return false;
	}
	return true;
}

declare module "@tanstack/react-query" {
	interface Register {
		queryKey: QueryKey;
		mutationKey: QueryKey;
	}
}

export const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			experimental_prefetchInRender: true,
			retryDelay: RETRY_DELAY,
			retry: handleRetry,
		},
		mutations: {
			retryDelay: RETRY_DELAY,
			retry: handleRetry,
		},
	},
});
