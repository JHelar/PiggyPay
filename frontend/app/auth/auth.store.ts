import * as SecureStore from "expo-secure-store";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

export const AuthState = {
	UNAUTHORIZED: "AuthState(UNAUTHORIZED)",
	VERIFYING: "AuthState(VERIFYING)",
	AUTHORIZED: "AuthState(AUTHORIZED)",
} as const;

export type AuthState = typeof AuthState;

type AuthStoreState = {
	state: AuthState[keyof AuthState];
	accessToken?: string;
};

export const useAuth = create<AuthStoreState>()(
	persist(
		(set, get) => ({
			state: AuthState.UNAUTHORIZED,
			accessToken: undefined,
		}),
		{
			name: "auth-store",
			storage: createJSONStorage(() => ({
				setItem: SecureStore.setItemAsync,
				getItem: SecureStore.getItemAsync,
				removeItem: SecureStore.deleteItemAsync,
			})),
		},
	),
);

export function getAccessToken() {
	const state = useAuth.getState();
	if (state.state === AuthState.AUTHORIZED) return state.accessToken;
}

export function authorize(accessToken: string) {
	useAuth.setState({
		state: AuthState.AUTHORIZED,
		accessToken,
	});
}

export function unauthorize() {
	useAuth.setState({
		state: AuthState.UNAUTHORIZED,
		accessToken: undefined,
	});
}
