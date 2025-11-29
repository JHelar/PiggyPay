import { Trans, useLingui } from "@lingui/react/macro";
import { useRouter } from "expo-router";
import type { ExtendedStackNavigationOptions } from "expo-router/build/layouts/StackClient";
import { View } from "react-native";
import { StyleSheet } from "react-native-unistyles";
import { UserContextMenu } from "@/components/ContextMenu";
import { Button as UIButton } from "@/ui/components/Button";
import { Icon } from "@/ui/components/Icon";
import { IconButton } from "@/ui/components/IconButton";
import { ScreenContentFooter } from "@/ui/components/ScreenContentFooter";

export const GroupRouteOptions: ExtendedStackNavigationOptions = {
	headerBackTitle: "Groups",
	headerBackVisible: true,
	headerRight() {
		const { t } = useLingui();
		return (
			<View style={styles.buttonContainer}>
				<IconButton name="ios-share" accessibilityLabel={t`Share group`} />
				<IconButton name="edit" accessibilityLabel={t`Edit group`} />
				<UserContextMenu />
			</View>
		);
	},
	unstable_sheetFooter() {
		const router = useRouter();
		return (
			<ScreenContentFooter
				primary={
					<UIButton
						onPress={() => router.navigate("/(modals)/Groups/New")}
						icon={<Icon name="add-circle-outline" />}
					>
						<Trans>New Expense</Trans>
					</UIButton>
				}
			/>
		);
	},
};

const styles = StyleSheet.create((theme) => ({
	buttonContainer: {
		flexDirection: "row",
		columnGap: theme.gap(2),
		alignItems: "center",
	},
}));
