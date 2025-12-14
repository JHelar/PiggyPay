import { Alert as RNAlert } from "react-native";
import { create } from "zustand";

let ALERT_COUNT = 0;
function generateId() {
	return ALERT_COUNT++;
}

type AlertResult = "success" | "canceled" | "aborted";

type AlertBasePayload = {
	title: string;
	body?: string;
	primaryText: string;
};

type AlertPayloadPrompt = AlertBasePayload & {
	variant: "prompt";
	cancelText: string;
};

type AlertPayloadDestructive = AlertBasePayload & {
	variant: "destructive";
	cancelText: string;
};

type AlertPayloadConfirm = AlertBasePayload & {
	variant: "confirm";
};

type AlertPayload =
	| AlertPayloadConfirm
	| AlertPayloadPrompt
	| AlertPayloadDestructive;

type AlertStoreState = {
	handle?(result: AlertResult): void;
	currentAlert?: AlertBasePayload & { id: number };
};

export const useAlert = create<AlertStoreState>(() => ({
	handle: undefined,
	currentAlert: undefined,
}));

const ALERT_OPTIONS = {
	cancelable: true,
	userInterfaceStyle: "unspecified",
} as const;

function show(payload: AlertPayload): Promise<AlertResult> {
	const currentHandle = useAlert.getState().handle;
	if (currentHandle) {
		currentHandle("aborted");
	}

	return new Promise<AlertResult>((res) => {
		if (payload.variant === "prompt" || payload.variant === "destructive") {
			RNAlert.prompt(
				payload.title,
				payload.body,
				[
					{
						isPreferred: true,
						style:
							payload.variant === "destructive" ? "destructive" : "default",
						text: payload.primaryText,
						onPress() {
							res("success");
						},
					},
					{
						isPreferred: false,
						style: "cancel",
						text: payload.cancelText,
						onPress() {
							res("canceled");
						},
					},
				],
				"default",
				undefined,
				undefined,
				{
					...ALERT_OPTIONS,
					onDismiss() {
						res("canceled");
					},
				},
			);
		} else {
			RNAlert.alert(
				payload.title,
				payload.body,
				[
					{
						isPreferred: true,
						onPress() {
							res("success");
						},
						style: "default",
						text: payload.primaryText,
					},
				],
				{
					...ALERT_OPTIONS,
					onDismiss() {
						res("canceled");
					},
				},
			);
		}
		useAlert.setState({
			handle: res,
			currentAlert: {
				...payload,
				id: generateId(),
			},
		});
	});
}

export const Alert = {
	prompt(payload: Omit<AlertPayloadPrompt, "variant">) {
		return show({
			variant: "prompt",
			...payload,
		});
	},
	destructive(payload: Omit<AlertPayloadDestructive, "variant">) {
		return show({
			variant: "destructive",
			...payload,
		});
	},
	confirm(payload: Omit<AlertPayloadConfirm, "variant">) {
		return show({
			variant: "confirm",
			...payload,
		});
	},
};
