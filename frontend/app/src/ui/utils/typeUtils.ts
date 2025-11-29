type ObjectKeyPaths<
	Source extends Record<PropertyKey, unknown>,
	Prefix extends string = "",
> = {
	[K in keyof Source]: K extends string
		?
				| `${Prefix}${K}`
				| (Source[K] extends Record<PropertyKey, unknown>
						? ObjectKeyPaths<Source[K], `${Prefix}${K}.`>
						: never)
		: never;
}[keyof Source];

export type Prettify<T> = {
	[K in keyof T]: T[K];
} & {};

export type PartialRequired<
	Source extends Record<PropertyKey, unknown>,
	Prop extends ObjectKeyPaths<Source>,
	State extends string = Prop,
> = State extends keyof Source
	? Omit<Source, State> & Required<Pick<Source, State>>
	: {
			[K in keyof Source]: State extends `${K & string}.${infer Tail}`
				? Source[K] extends Record<PropertyKey, unknown>
					? PartialRequired<Source[K], Prop, Tail>
					: Source[K]
				: Source[K];
		};
