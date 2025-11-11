export function isDefined<Value>(
	value: Value | null | undefined,
): value is Value {
	if (value === null || value === undefined) return false;
	return true;
}
