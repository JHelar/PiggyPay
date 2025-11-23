import { useNavigation } from "expo-router";
import type { ExtendedStackNavigationOptions } from "expo-router/build/layouts/StackClient";
import { useEffect } from "react";

export function useScreenOptionsEffect(
	options: ExtendedStackNavigationOptions,
) {
	const navigation = useNavigation();
	useEffect(() => {
		navigation.setOptions(options);
	}, [navigation.setOptions, options]);
}
