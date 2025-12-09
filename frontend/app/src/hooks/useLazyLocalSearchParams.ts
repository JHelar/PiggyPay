import {
	type Route,
	type RouteParams,
	type UnknownOutputParams,
	useNavigationContainerRef,
} from "expo-router";

export function useLazyLocalSearchParams<T extends UnknownOutputParams>(): T;
export function useLazyLocalSearchParams<T extends Route>(): RouteParams<T>;
export function useLazyLocalSearchParams<T extends Route>() {
	const ref = useNavigationContainerRef();
	return new Proxy<NonNullable<RouteParams<T>>>(
		{} as unknown as NonNullable<RouteParams<T>>,
		{
			get(_, propName) {
				const params = ref.getCurrentRoute()?.params;
				if (params === undefined) {
					return;
				}
				if (propName in params) {
					const propKey = propName as keyof typeof params;
					return params[propKey];
				}
			},
		},
	);
}
