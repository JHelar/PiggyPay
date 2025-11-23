import type { ReactNode } from "react";
import { signOut } from "@/api/user";
import { queryClient } from "@/query";

export abstract class ErrorBoundaryError extends Error {
	public abstract render(reset: () => void): ReactNode;
	public abstract handle(reset: () => void): boolean;
}

export class NetworkError extends ErrorBoundaryError {
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
