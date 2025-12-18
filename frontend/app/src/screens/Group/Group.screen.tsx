import { Trans, useLingui } from "@lingui/react/macro";
import { FlashList } from "@shopify/flash-list";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import { use } from "react";
import { View } from "react-native";
import { StyleSheet } from "react-native-unistyles";
import { deleteExpense, type Expense } from "@/api/expense";
import { ContextMenu } from "@/components/ContextMenu";
import { useScreenFocusSetTheme } from "@/hooks/useScreenFocusSetTheme";
import { Button } from "@/ui/components/Button";
import { Icon } from "@/ui/components/Icon";
import { IconButton } from "@/ui/components/IconButton";
import { InfoSquare } from "@/ui/components/InfoSquare";
import { ListItem } from "@/ui/components/ListItem";
import { Text } from "@/ui/components/Text";
import type { GroupScreenProps } from "./Group.types";

type ExpenseListItemProps = {
	expense: Expense;
	groupId: number;
	onPress(): void;
};
function ExpenseListItem({ expense, groupId, onPress }: ExpenseListItemProps) {
	const { t } = useLingui();
	const router = useRouter();
	const { mutateAsync: deleteExpenseMutation } = useMutation(deleteExpense());

	return (
		<ListItem
			onPress={onPress}
			middle={
				<View style={styles.itemMiddle}>
					<Icon
						name="initials"
						firstName={expense.first_name}
						lastName={expense.last_name}
						style={styles.icon}
					/>
					<Text variant="small">{expense.name}</Text>
				</View>
			}
			right={
				<View>
					<Text variant="body">{expense.cost}kr</Text>
					<ContextMenu
						trigger={
							<IconButton
								name="more-vert"
								accessibilityLabel={t`Open expense menu`}
							/>
						}
						actions={[
							{
								icon: "edit",
								title: t`Edit expense`,
								onPress() {
									router.navigate({
										pathname: "/(modals)/Groups/[groupId]/[expenseId]/Edit",
										params: {
											expenseId: expense.id,
											groupId,
										},
									});
								},
							},
							{
								icon: "delete",
								title: t`Delete expense`,
								async onPress() {
									try {
										await deleteExpenseMutation({
											groupId,
											expenseId: expense.id,
										});
									} finally {
									}
								},
							},
						]}
					/>
				</View>
			}
		/>
	);
}

export function GroupScreen({ query }: GroupScreenProps) {
	const group = use(query.promise);
	const router = useRouter();

	useScreenFocusSetTheme(group.group_theme);

	return (
		<FlashList
			data={group.expenses}
			keyExtractor={({ id }) => id.toString()}
			style={styles.container}
			ListHeaderComponent={
				<InfoSquare
					title={<Text>{group.group_name}</Text>}
					cta={<></>}
					info={<View></View>}
				/>
			}
			ListHeaderComponentStyle={styles.header}
			renderItem={({ item }) => (
				<ExpenseListItem expense={item} groupId={group.id} onPress={() => {}} />
			)}
			ItemSeparatorComponent={() => <View style={styles.spacer} />}
			ListEmptyComponent={
				<View>
					<Text variant="title">
						<Trans>No expenses yet!</Trans>
					</Text>
					<Button
						variant="filled"
						onPress={() => {
							router.navigate({
								pathname: "/(modals)/Groups/[groupId]/NewExpense",
								params: {
									groupId: group.id,
								},
							});
						}}
					>
						<Trans>Add new expense</Trans>
					</Button>
				</View>
			}
		/>
	);
}

const styles = StyleSheet.create((theme) => ({
	container: {
		paddingTop: theme.gap(1),
	},
	header: {
		paddingBottom: theme.gap(4),
	},
	spacer: {
		height: theme.gap(1),
	},
	itemMiddle: {
		columnGap: theme.gap(1),
		flexDirection: "row",
		alignItems: "center",
	},
	icon: {
		...theme.elevation(1),
		shadowOffset: {
			height: 0,
			width: 1,
		},
	},
}));
