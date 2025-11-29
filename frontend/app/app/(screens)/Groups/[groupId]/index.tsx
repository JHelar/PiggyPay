import { useRoute } from "@react-navigation/native";
import { useQuery } from "@tanstack/react-query";
import { type RouteParams, useFocusEffect } from "expo-router";
import { useCallback } from "react";
import { UnistylesRuntime } from "react-native-unistyles";
import { getGroup } from "@/api/group";
import { ColorThemeToAppTheme } from "@/hooks/useScreenFocusSetTheme";
import { GroupScreen } from "@/screens/Group";

type GroupRouteParams = RouteParams<"/(screens)/Groups/[groupId]">;

export default function Group() {
	const router = useRoute();
	const { groupId } = router.params as GroupRouteParams;
	const query = useQuery(getGroup(groupId));

	useFocusEffect(
		useCallback(() => {
			const theme = query.data?.group_theme;
			if (theme) {
				UnistylesRuntime.setTheme(ColorThemeToAppTheme[theme]);
			}

			return () => {
				UnistylesRuntime.setTheme("blueLight");
			};
		}, [query.data?.group_theme]),
	);

	return <GroupScreen query={query} />;
}
