import type { ZodType } from "zod";

export type BuiltInEventType = "open" | "message" | "error" | "done" | "close";
export type EventType<E extends string = never> = E | BuiltInEventType;

export interface MessageEvent {
	type: "message";
	data: string | null;
	lastEventId: string | null;
	url: string;
}

export interface OpenEvent {
	type: "open";
}

export interface DoneEvent {
	type: "done";
}

export interface CloseEvent {
	type: "close";
}

export interface TimeoutEvent {
	type: "timeout";
}

export interface ErrorEvent {
	type: "error";
	message: string;
	xhrState: number;
	xhrStatus: number;
}

export interface CustomEvent<E extends string, Data> {
	type: E;
	data: Data;
	lastEventId: string | null;
	url: string;
}

export interface ExceptionEvent {
	type: "exception";
	message: string;
	error: Error;
}

export interface EventSourceOptions<
	Resolvers extends Record<E, ZodType>,
	E extends string = keyof Resolvers & string,
> {
	method?: string;
	timeout?: number;
	timeoutBeforeConnection?: number;
	withCredentials?: boolean;
	headers?: Record<string, any>;
	body?: any;
	debug?: boolean;
	pollingInterval?: number;
	lineEndingCharacter?: string;
	events: Resolvers;
}

type BuiltInEventMap = {
	message: MessageEvent;
	open: OpenEvent;
	done: DoneEvent;
	close: CloseEvent;
	error: ErrorEvent | TimeoutEvent | ExceptionEvent;
};

export type EventSourceEvent<
	Resolvers extends Record<E, ZodType>,
	E extends keyof Resolvers & string,
	T extends EventType<E>,
> = T extends BuiltInEventType
	? BuiltInEventMap[T]
	: T extends keyof Resolvers
		? CustomEvent<T, Resolvers[T]["_output"]>
		: never;

export type EventSourceListener<
	Resolvers extends Record<E, ZodType>,
	E extends keyof Resolvers & string,
	T extends EventType<E> = never,
> = (event: EventSourceEvent<Resolvers, E, T>) => void;
