import { useLingui } from "@lingui/react/macro";
import { useRoute } from "@react-navigation/native";
import { useRouter } from "expo-router";
import { use } from "react";
import { View } from "react-native";
import { StyleSheet } from "react-native-unistyles";
import { UserContextMenu } from "@/components/ContextMenu";
import { useScreenFocusSetTheme } from "@/hooks/useScreenFocusSetTheme";
import { useScreenOptionsEffect } from "@/hooks/useScreenOptionsEffect";
import { IconButton } from "@/ui/components/IconButton";
import { Text } from "@/ui/components/Text";
import type { GroupRouteParams } from "./Group.route";
import type { GroupScreenProps } from "./Group.types";

export function GroupScreen({ query }: GroupScreenProps) {
	const group = use(query.promise);
	const router = useRouter();
	const route = useRoute();
	const { t } = useLingui();
	const { groupId } = route.params as GroupRouteParams;

	useScreenFocusSetTheme(group.group_theme);

	useScreenOptionsEffect({
		headerRight() {
			return (
				<View style={styles.buttonContainer}>
					<IconButton name="ios-share" accessibilityLabel={t`Share group`} />
					<IconButton
						name="edit"
						accessibilityLabel={t`Edit group`}
						onPress={() =>
							router.navigate({
								pathname: "/(modals)/Groups/[groupId]/Edit",
								params: {
									groupId,
								},
							})
						}
					/>
					<UserContextMenu />
				</View>
			);
		},
	});

	return (
		<View>
			<Text variant="title">{group.group_name}</Text>
		</View>
	);
}

const styles = StyleSheet.create((theme) => ({
	buttonContainer: {
		flexDirection: "row",
		columnGap: theme.gap(2),
		alignItems: "center",
	},
}));
