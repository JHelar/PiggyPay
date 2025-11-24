import type { ReactNode } from "react";
import { signOut } from "@/api/user";
import { queryClient } from "@/query";

export interface ErrorBoundaryError {
	render(reset: () => void): ReactNode;
	handle(reset: () => void): boolean;
}

export function isErrorBoundaryError(
	error: unknown,
): error is ErrorBoundaryError {
	if (error instanceof NetworkError) {
		return true;
	}
	return false;
}

export class NetworkError extends Error implements ErrorBoundaryError {
	constructor(
		public statusCode: number,
		error: Error,
	) {
		super(`[NetworkError (${statusCode})] ${error.message}`, { cause: error });
	}

	public render(): ReactNode {
		return null;
	}

	public handle(reset: () => void): boolean {
		if (this.statusCode === 401) {
			queryClient
				.getMutationCache()
				.build(queryClient, signOut())
				.execute()
				.finally(reset);
			return true;
		}
		return false;
	}
}
