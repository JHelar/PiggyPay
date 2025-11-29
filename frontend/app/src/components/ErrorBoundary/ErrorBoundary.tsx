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
	fallback: ReactNode;
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
		fallback: null,
	};

	public static getDerivedStateFromError(
		error: Error,
		errorInfo: ErrorInfo,
	): ErrorBoundaryState {
		return { hasError: true, error, fallback: null };
	}

	public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
		let fallback: ReactNode = null;
		if (isErrorBoundaryError(error)) {
			fallback = error.handle(this.handleReset);
		}
		this.setState({ error, hasError: true, fallback });
	}

	private handleReset() {
		this.props.queryReset();
		this.setState({ hasError: false, error: null, fallback: null });
	}

	public render() {
		if (this.state.hasError) {
			return this.state.fallback;
		}

		return this.props.children;
	}
}
