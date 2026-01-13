import { queryClient, SSEEventSource } from "@/query";
import { Group } from "./group";

export function createUserStream() {
	const source = new SSEEventSource("user/stream", {
		debug: true,
		events: {
			group: Group,
		},
	});

	source.addEventListener("group", (event) => {
		queryClient.setQueryData(
			["groups", { id: event.data.id.toString() }],
			() => event.data,
		);
	});
}
