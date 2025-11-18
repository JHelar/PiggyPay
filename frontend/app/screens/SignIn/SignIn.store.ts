import { router } from "expo-router";
import { create } from "zustand";
import type { User } from "@/api/user";
import { authorize } from "@/auth/auth.store";

const SignInState = ["EmailSubmit", "VerifyCode", "NewUser"] as const;
type SignInState = (typeof SignInState)[number];

type SignInStateTransition =
	| ((payload: SignInStoreStatePayloads) => Promise<SignInState | void> | void)
	| SignInState;
type SignInStateTransitionType = "next" | "back" | "error";

const SignInStateMachine: Record<
	SignInState,
	Record<SignInStateTransitionType, SignInStateTransition>
> = {
	EmailSubmit: { next: "VerifyCode", back: router.back, error: router.back },
	VerifyCode: {
		async next(payload) {
			if (payload === undefined) {
				router.back();
				return;
			}
			if (payload.VerifyCode?.newUser) {
				return "NewUser";
			} else if (payload.VerifyCode?.sessionId) {
				return authorize(payload.VerifyCode?.sessionId);
			}
			router.back();
		},
		back: "EmailSubmit",
		error: router.back,
	},
	NewUser: {
		next(payload) {
			if (payload?.NewUser?.user && payload.VerifyCode?.sessionId) {
				authorize(payload.VerifyCode?.sessionId);
				return router.replace("/Groups");
			}
			return router.back();
		},
		back: router.back,
		error: router.back,
	},
};

async function getNextState(
	currentState: SignInState,
	type: SignInStateTransitionType,
	payloads: SignInStoreStatePayloads,
) {
	const transition = SignInStateMachine[currentState][type];
	if (typeof transition === "function") return await transition(payloads);
	return transition;
}

type AuthPayload = {
	email?: string;
	sessionId?: string;
	newUser?: boolean;
	user?: User;
};

type SignInStoreStatePayloads = Partial<Record<SignInState, AuthPayload>>;

type SignInStoreState = {
	currentState: SignInState;
	statePayload: SignInStoreStatePayloads;
	isTransitioning: boolean;
	start(): void;
	transition(
		type: SignInStateTransitionType,
		payload?: AuthPayload,
	): Promise<void>;
};

export const useSignInStore = create<SignInStoreState>((set, get) => ({
	currentState: "EmailSubmit" as const,
	isTransitioning: false,
	statePayload: new Map(),
	start() {
		set({ currentState: "EmailSubmit", statePayload: {} });
		router.navigate("/SignIn");
	},
	async transition(type, payload) {
		try {
			set((prev) => ({
				isTransitioning: true,
				statePayload: { ...prev.statePayload, [prev.currentState]: payload },
			}));
			const nextState = await getNextState(
				get().currentState,
				type,
				get().statePayload,
			);
			if (typeof nextState === "string") {
				set({ currentState: nextState });
			}
		} catch {
			const nextState = await getNextState(
				get().currentState,
				"error",
				get().statePayload,
			);
			if (typeof nextState === "string") {
				set({ currentState: nextState });
			}
		} finally {
			set({ isTransitioning: false });
		}
	},
}));
