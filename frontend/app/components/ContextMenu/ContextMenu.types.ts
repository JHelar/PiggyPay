import type { RenderSlot } from "@/ui/utils/renderSlot";

export type ContextMenuIcon = "user" | "edit" | "signOut" | "delete";

type ContextMenuAction = {
	title: string;
	icon: ContextMenuIcon;
	onPress(): void;
};

export type ContextMenuProps = {
	trigger: RenderSlot;
	actions: ContextMenuAction[];
};
