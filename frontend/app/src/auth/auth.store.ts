import { SplashScreen } from "expo-router";
import * as SecureStore from "expo-secure-store";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { getUser } from "@/api/user";
import { queryClient } from "@/query";

export const AuthState = {
	INITIALIZING: "AuthState(INITIALIZING)",
	UNAUTHORIZED: "AuthState(UNAUTHORIZED)",
	AUTHORIZED: "AuthState(AUTHORIZED)",
} as const;

export type AuthState = typeof AuthState;

type AuthStoreState = {
	state: AuthState[keyof AuthState];
	accessToken?: string;
};

SplashScreen.preventAutoHideAsync();
export const useAuth = create<AuthStoreState>()(
	persist(
		(set, get) => ({
			state: AuthState.INITIALIZING,
			accessToken: undefined,
		}),
		{
			name: "auth-store",
			storage: createJSONStorage(() => ({
				setItem: SecureStore.setItemAsync,
				getItem: SecureStore.getItemAsync,
				removeItem: SecureStore.deleteItemAsync,
			})),
			onRehydrateStorage() {
				return (state) => {
					if (state === undefined) return;

					if (state.accessToken) {
						queryClient
							.fetchQuery(getUser())
							.then((data) => {
								useAuth.setState({ state: AuthState.AUTHORIZED });
							})
							.catch(() => {
								useAuth.setState({
									state: AuthState.UNAUTHORIZED,
									accessToken: undefined,
								});
							})
							.finally(() => {
								SplashScreen.hideAsync();
							});
					} else {
						useAuth.setState({
							state: AuthState.UNAUTHORIZED,
							accessToken: undefined,
						});
						SplashScreen.hideAsync();
					}
				};
			},
			partialize(state) {
				return {
					accessToken: state.accessToken,
				};
			},
		},
	),
);

export function getAccessToken() {
	const state = useAuth.getState();
	return state.accessToken;
}

export function authorize(accessToken: string) {
	useAuth.setState({
		state: AuthState.AUTHORIZED,
		accessToken,
	});
	queryClient.prefetchQuery(getUser());
}

export function unauthorize() {
	useAuth.setState({
		state: AuthState.UNAUTHORIZED,
		accessToken: undefined,
	});
}
