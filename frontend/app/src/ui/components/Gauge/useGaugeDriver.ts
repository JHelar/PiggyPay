import { useEffect, useRef } from "react";
import { clamp, makeMutable } from "react-native-reanimated";
import type { UseGaugeDriverArguments } from "./Gauge.types";

function getProgress(value: number, min: number, max: number) {
	return clamp(value, min, max) / max;
}

export function useGaugeDriver({
	currentValue,
	maxValue,
	minValue,
	format,
}: UseGaugeDriverArguments) {
	const driver = useRef({
		progress: makeMutable(getProgress(currentValue, minValue, maxValue)),
		minValue: makeMutable(minValue),
		maxValue: makeMutable(maxValue),
		text: makeMutable(format(currentValue, minValue, maxValue)),
	});

	useEffect(() => {
		driver.current.progress.set(getProgress(currentValue, minValue, maxValue));
		driver.current.text.set(format(currentValue, minValue, maxValue));
		driver.current.minValue.set(minValue);
		driver.current.maxValue.set(maxValue);
	}, [currentValue, minValue, maxValue, format]);

	return driver.current;
}
