import { create } from "zustand";
import type { SnackbarProps } from "@/ui/components/Snackbar";
import { SNACKBAR_AUTO_CLOSE_TIMEOUT } from "@/ui/components/Snackbar/Snackbar.consts";

type SnackbarInstance = SnackbarProps & {
	id: number;
};

type SnackbarStoreState = {
	counter: number;
	current?: SnackbarInstance;
	queue: SnackbarInstance[];
	push(props: SnackbarProps): void;
	pop(): void;
};
export const useSnackbar = create<SnackbarStoreState>((set, get) => ({
	counter: 0,
	queue: [],
	current: undefined,
	push(props) {
		set(({ counter }) => ({ counter: counter + 1 }));
		const instance: SnackbarInstance = {
			id: get().counter,
			...props,
		};
		if (get().current === undefined) {
			show(instance);
		} else {
			set(({ queue }) => [instance, ...queue]);
		}
	},
	pop() {
		const [instance, ...queue] = get().queue;
		set({ queue });
		if (instance) {
			show(instance);
		} else {
			set({ current: undefined });
		}
	},
}));

function show(instance: SnackbarInstance) {
	let autoHide = true;
	if (instance.action) {
		autoHide = false;
		const instanceAction = instance.action?.onAction;
		instance.action.onAction = () => {
			useSnackbar.getState().pop();
			instanceAction?.();
		};
	}
	if (instance.onClose) {
		autoHide = false;
		const instanceClose = instance.onClose;
		instance.onClose = () => {
			useSnackbar.getState().pop();
			instanceClose();
		};
	}
	if (autoHide) {
		setTimeout(useSnackbar.getState().pop, SNACKBAR_AUTO_CLOSE_TIMEOUT);
	}
	useSnackbar.setState({ current: instance });
}

export const Snackbar = {
	toast(props: SnackbarProps) {
		useSnackbar.getState().push(props);
	},
};
