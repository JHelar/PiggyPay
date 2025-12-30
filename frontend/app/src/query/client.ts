import { QueryClient } from "@tanstack/react-query";
import "./onlineManager";

import "@tanstack/react-query";

type QueryKey = ["user" | "groups" | "transactions", ...(readonly unknown[])];

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
			retry: false,
		},
		mutations: {
			retry: false,
		},
	},
});
