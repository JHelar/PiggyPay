import { router } from "expo-router";
import { create } from "zustand";
import { AuthState, useAuth } from "@/auth";
import { authorize } from "@/auth/auth.store";

const SignInState = ["EmailSubmit", "VerifyCode", "NewUser"] as const;
type SignInState = (typeof SignInState)[number];

type SignInStateTransition =
	| ((payload?: AuthPayload) => Promise<SignInState | void> | void)
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
			if (payload.state === AuthState.AUTHORIZED) {
				authorize(payload.sessionId);
				if (payload.newUser) return "NewUser";
			}
			router.back();
		},
		back: "EmailSubmit",
		error: router.back,
	},
	NewUser: {
		next: router.back,
		back: router.back,
		error: router.back,
	},
};

async function getNextState(
	currentState: SignInState,
	type: SignInStateTransitionType,
	transitionPayload?: AuthPayload,
) {
	const transition = SignInStateMachine[currentState][type];
	if (typeof transition === "function")
		return await transition(transitionPayload);
	return transition;
}

type AuthPayload =
	| {
			state: AuthState["UNAUTHORIZED"];
	  }
	| {
			state: AuthState["VERIFYING"];
			email: string;
	  }
	| {
			state: AuthState["AUTHORIZED"];
			sessionId: string;
			newUser: boolean;
	  };

type SignInStoreState = {
	currentState: SignInState;
	currentPayload?: AuthPayload;
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
	start() {
		set({ currentState: "EmailSubmit", currentPayload: undefined });
		router.navigate("/SignIn");
	},
	async transition(type, payload) {
		try {
			set({ isTransitioning: true, currentPayload: payload });
			const nextState = await getNextState(get().currentState, type, payload);
			if (typeof nextState === "string") {
				set({ currentState: nextState });
			}
		} catch {
			const nextState = await getNextState(get().currentState, "error");
			if (typeof nextState === "string") {
				set({ currentState: nextState });
			}
		} finally {
			set({ isTransitioning: false });
		}
	},
}));
