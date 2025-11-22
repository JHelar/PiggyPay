type SnackbarAction = {
	text: string;
	onAction?(): void;
};

export type SnackbarProps = {
	text: string;
	action?: SnackbarAction;
	onClose?(): void;
};
