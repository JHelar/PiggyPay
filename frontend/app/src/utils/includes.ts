/**
 * A better typed Array.prototype.includes, allows search value to be any string **or** a string within the array.
 * Return type narrow `searchValue` to be a value of `array`
 * @param array
 * @param searchValue
 * @returns type narrow `searchValue` to be a value of `array`
 */
export function includes<
	const Values extends readonly any[],
	Search = Values[number] extends string ? string & {} : number,
>(
	array: Values,
	searchValue: Values[number] | Search,
): searchValue is Values[number];
export function includes<
	const Values extends any[],
	Search = Values[number] extends string ? string & {} : number,
>(
	array: Values,
	searchValue: Values[number] | Search,
): searchValue is Values[number] {
	return array.includes(searchValue);
}
