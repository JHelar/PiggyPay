import { type MacroMessageDescriptor, msg } from "@lingui/core/macro";
import { Trans, useLingui } from "@lingui/react/macro";
import { FlashList } from "@shopify/flash-list";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import { use, useCallback } from "react";
import { View } from "react-native";
import { StyleSheet, useUnistyles } from "react-native-unistyles";
import { deleteExpense, type Expense } from "@/api/expense";
import { GroupState } from "@/api/group";
import { MemberState, memberReadyToPay } from "@/api/member";
import { ContextMenu } from "@/components/ContextMenu";
import { Clouds } from "@/components/SVG/Clouds";
import { useScreenFocusSetTheme } from "@/hooks/useScreenFocusSetTheme";
import { useScreenOptionsEffect } from "@/hooks/useScreenOptionsEffect";
import { Button } from "@/ui/components/Button";
import { Gauge, useGaugeDriver } from "@/ui/components/Gauge";
import { Icon } from "@/ui/components/Icon";
import { IconButton } from "@/ui/components/IconButton";
import { InfoSquare } from "@/ui/components/InfoSquare";
import { ListItem } from "@/ui/components/ListItem";
import { ScreenContentFooter } from "@/ui/components/ScreenContentFooter";
import { ScreenContentFooterSpacer } from "@/ui/components/ScreenContentFooter/ScreenContentFooter";
import { Text } from "@/ui/components/Text";
import { includes } from "@/utils/includes";
import type { GroupScreenProps } from "./Group.types";

const GroupStateToHumanReadable: Record<GroupState, MacroMessageDescriptor> = {
	[GroupState.enum.Archived]: msg`Archived`,
	[GroupState.enum.Expenses]: msg`Adding expenses`,
	[GroupState.enum.Generating]: msg`Calculating group dept`,
	[GroupState.enum.Paying]: msg`Resolving group dept`,
	[GroupState.enum.Resolved]: msg`Group dept resolved`,
};

type ExpenseListItemProps = {
	expense: Expense;
	groupId: number;
	groupState: GroupState;
};
function ExpenseListItem({
	expense,
	groupId,
	groupState,
}: ExpenseListItemProps) {
	const { t } = useLingui();
	const router = useRouter();
	const { mutateAsync: deleteExpenseMutation } = useMutation(deleteExpense());

	return (
		<ListItem
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
					{includes(
						[GroupState.enum.Paying, GroupState.enum.Generating],
						groupState,
					) && <Icon name="lock-outline" />}
					{groupState === GroupState.enum.Resolved && <Icon name="check" />}
					{groupState === GroupState.enum.Expenses && (
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
					)}
				</View>
			}
		/>
	);
}

export function GroupScreen({ query }: GroupScreenProps) {
	const group = use(query.promise);
	const router = useRouter();
	const { mutate: setReadyToPay, isPending } = useMutation(memberReadyToPay());
	const { theme } = useUnistyles();
	const { t } = useLingui();
	const formatGaugeText = useCallback(
		(currentValue: number, minValue: number, maxValue: number) => {
			return `${currentValue} / ${maxValue}`;
		},
		[],
	);

	const gauge = useGaugeDriver({
		currentValue: group.members.filter(({ member_state }) =>
			group.group_state === GroupState.enum.Expenses
				? MemberState.enum.Ready === member_state
				: MemberState.enum.Resolved === member_state,
		).length,
		maxValue: group.members.length,
		minValue: 0,
		format: formatGaugeText,
	});

	useScreenFocusSetTheme(group.group_theme);

	useScreenOptionsEffect({
		unstable_sheetFooter() {
			return (
				<ScreenContentFooter
					primary={
						group.group_state === GroupState.enum.Expenses ? (
							<Button
								onPress={() =>
									router.navigate({
										pathname: "/(modals)/Groups/[groupId]/NewExpense",
										params: {
											groupId: group.id,
										},
									})
								}
								icon={<Icon name="add-circle-outline" />}
							>
								<Trans>New Expense</Trans>
							</Button>
						) : group.member_state === MemberState.enum.Paying ? (
							<Button
								onPress={() =>
									router.navigate({
										pathname: "/(screens)/Groups/[groupId]/Pay",
										params: {
											groupId: group.id,
										},
									})
								}
								icon={<Icon name="add-circle-outline" />}
							>
								<Trans>Pay</Trans>
							</Button>
						) : undefined
					}
					secondary={
						group.member_state === MemberState.enum.Adding ? (
							<Button
								icon={<Icon name="check" />}
								onPress={() => setReadyToPay(group.id.toString())}
								loading={isPending}
							>
								<Trans>Ready to pay</Trans>
							</Button>
						) : undefined
					}
				/>
			);
		},
	});

	if (group.expenses.length === 0) {
		return (
			<>
				<Clouds style={styles.clouds} />
				<View style={styles.emptyContainer}>
					<Text variant="title" style={styles.emptyHeadline}>
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
			</>
		);
	}

	return (
		<FlashList
			data={group.expenses}
			keyExtractor={({ id }) => id.toString()}
			style={styles.container}
			ListHeaderComponent={
				<InfoSquare
					title={<Text variant="title">{group.group_name}</Text>}
					info={
						<Gauge
							driver={gauge}
							icon={
								<Icon
									name={
										group.group_state === GroupState.enum.Expenses
											? "check"
											: "euro-symbol"
									}
								/>
							}
						/>
					}
					cta={
						<Text variant="body">
							{t(GroupStateToHumanReadable[group.group_state])}
						</Text>
					}
				/>
			}
			ListHeaderComponentStyle={styles.header}
			renderItem={({ item }) => (
				<ExpenseListItem
					expense={item}
					groupId={group.id}
					groupState={group.group_state}
				/>
			)}
			scrollIndicatorInsets={{
				right: -theme.gap(2),
			}}
			ListFooterComponent={<ScreenContentFooterSpacer />}
			ItemSeparatorComponent={() => <View style={styles.spacer} />}
		/>
	);
}

const styles = StyleSheet.create((theme, rt) => ({
	clouds: {
		position: "absolute",
		top: 0,
		height: rt.screen.height,
		width: rt.screen.width,
	},
	emptyContainer: {
		justifyContent: "center",
		rowGap: theme.gap(4),
		flex: 1,
	},
	emptyHeadline: {
		textAlign: "center",
	},
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
