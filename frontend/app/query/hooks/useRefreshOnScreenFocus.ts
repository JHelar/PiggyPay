import { useFocusEffect } from "@react-navigation/native";
import { useQueryClient } from "@tanstack/react-query";
import { useCallback, useRef } from "react";

export function useRefreshOnScreenFocus() {
	const queryClient = useQueryClient();
	const firstTimeRef = useRef(true);

	useFocusEffect(
		useCallback(() => {
			if (firstTimeRef.current) {
				firstTimeRef.current = false;
				return;
			}

			// refetch all stale active queries
			queryClient.refetchQueries({
				queryKey: ["groups", "user"],
				stale: true,
				type: "active",
			});
		}, [queryClient]),
	);
}
