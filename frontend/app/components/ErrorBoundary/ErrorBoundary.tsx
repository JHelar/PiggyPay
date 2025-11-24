import type { QueryErrorResetFunction } from "@tanstack/react-query";
import { Component, type ErrorInfo, type ReactNode } from "react";
import { isErrorBoundaryError } from "./errors";

type ErrorBoundaryProps = {
	children: ReactNode;
	queryReset: QueryErrorResetFunction;
};

type ErrorBoundaryState = {
	hasError: boolean;
	error: Error | null;
};

export class ErrorBoundary extends Component<
	ErrorBoundaryProps,
	ErrorBoundaryState
> {
	constructor(props: ErrorBoundaryProps) {
		super(props);

		this.handleReset = this.handleReset.bind(this);
	}
	public state: ErrorBoundaryState = {
		hasError: false,
		error: null,
	};

	public static getDerivedStateFromError(
		this: ErrorBoundary,
		error: Error,
	): ErrorBoundaryState {
		return { hasError: true, error };
	}

	public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
		if (isErrorBoundaryError(error)) {
			if (error.handle(this.handleReset)) {
				return { hasError: false, error: null };
			}
		}
	}

	private handleReset() {
		this.props.queryReset();
		this.setState({ hasError: false, error: null });
	}

	public render() {
		if (this.state.hasError) {
			if (isErrorBoundaryError(this.state.error)) {
				return this.state.error.render(this.handleReset);
			}
			return null;
		}

		return this.props.children;
	}
}
