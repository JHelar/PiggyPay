import {
	Button,
	type ButtonProps,
	Host,
	ContextMenu as IOSContextMenu,
} from "@expo/ui/swift-ui";
import { renderSlot } from "@/ui/utils/renderSlot";
import type { ContextMenuIcon, ContextMenuProps } from "./ContextMenu.types";

const ContextMenuIconToSystemImage: Record<
	ContextMenuIcon,
	ButtonProps["systemImage"]
> = {
	edit: "pencil",
	user: "person.circle",
	signOut: "rectangle.portrait.and.arrow.right",
	delete: "trash",
};

const ContextMenuIconToRole: Record<ContextMenuIcon, ButtonProps["role"]> = {
	delete: "destructive",
	edit: undefined,
	signOut: undefined,
	user: undefined,
};

export function ContextMenu({ trigger, actions }: ContextMenuProps) {
	const Trigger = renderSlot(trigger);
	return (
		<Host>
			<IOSContextMenu>
				<IOSContextMenu.Items>
					{actions.map((action, index) => (
						<Button
							key={action.title}
							systemImage={ContextMenuIconToSystemImage[action.icon]}
							onPress={action.onPress}
							variant={index > 0 ? "bordered" : undefined}
							role={ContextMenuIconToRole[action.icon]}
						>
							{action.title}
						</Button>
					))}
				</IOSContextMenu.Items>
				<IOSContextMenu.Trigger>{Trigger}</IOSContextMenu.Trigger>
			</IOSContextMenu>
		</Host>
	);
}
