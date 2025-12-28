/**
 * A better typed Array.prototype.includes, allows search value to be any string **or** a string within the array.
 * Return type narrow `searchValue` to be a value of `array`
 * @param array
 * @param searchValue
 * @returns type narrow `searchValue` to be a value of `array`
 */
export function includes<const Values extends string[]>(
	array: Values,
	searchValue: Values[number] | (string & {}),
): searchValue is Values[number] {
	return array.includes(searchValue);
}
