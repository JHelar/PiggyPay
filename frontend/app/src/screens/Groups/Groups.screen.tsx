import { Trans } from "@lingui/react/macro";
import { FlashList } from "@shopify/flash-list";
import { useRouter } from "expo-router";
import { use } from "react";
import { View } from "react-native";
import { StyleSheet } from "react-native-unistyles";
import type { GroupWithMembers } from "@/api/group";
import { Button } from "@/ui/components/Button";
import { Icon } from "@/ui/components/Icon";
import { InfoSquare } from "@/ui/components/InfoSquare";
import { ListItem } from "@/ui/components/ListItem";
import { Text } from "@/ui/components/Text";
import type { GroupsScreenProps } from "./Groups.types";

type GroupListItemProps = {
	group: GroupWithMembers;
	onPress(): void;
};
function GroupListItem({ group, onPress }: GroupListItemProps) {
	return (
		<ListItem
			onPress={onPress}
			middle={
				<View style={styles.itemMiddle}>
					<Text variant="small">{group.group_name}</Text>
					<View style={styles.membersRow}>
						{group.members.map((member, index, members) => (
							<Icon
								key={member.member_id}
								name="initials"
								firstName={member.first_name}
								lastName={member.last_name}
								style={[styles.icon, { zIndex: members.length - index }]}
							/>
						))}
					</View>
				</View>
			}
			right={
				<View>
					<Text variant="body">{group.total_expenses}kr</Text>
					<Icon name="chevron-right" />
				</View>
			}
		/>
	);
}

export function GroupsScreen({ query }: GroupsScreenProps) {
	const groups = use(query.promise);
	const router = useRouter();

	return (
		<FlashList
			data={groups}
			keyExtractor={({ id }) => id.toString()}
			style={styles.container}
			ListHeaderComponent={
				<InfoSquare
					title={<Text>Latest expense</Text>}
					cta={<Button>Go to group</Button>}
					info={<View></View>}
				/>
			}
			ListHeaderComponentStyle={styles.header}
			renderItem={({ item }) => (
				<GroupListItem
					group={item}
					onPress={() => {
						router.navigate({
							pathname: "/(screens)/Groups/[groupId]",
							params: {
								groupId: item.id,
							},
						});
					}}
				/>
			)}
			ItemSeparatorComponent={() => <View style={styles.spacer} />}
			ListEmptyComponent={
				<View>
					<Text variant="title">
						<Trans>Nothing to see here!</Trans>
					</Text>
					<Button
						variant="filled"
						onPress={() => router.navigate("/(modals)/Groups/New")}
					>
						<Trans>Create new group</Trans>
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
		rowGap: theme.gap(1),
	},
	icon: {
		...theme.elevation(1),
		shadowOffset: {
			height: 0,
			width: 1,
		},
		marginLeft: -theme.gap(1),
	},
	membersRow: {
		paddingLeft: theme.gap(1),
		flexDirection: "row",
	},
}));
