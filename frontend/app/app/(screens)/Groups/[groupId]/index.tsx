import { useRoute } from "@react-navigation/native";
import { GroupScreen } from "@/screens/Group";

export default function Group() {
	const router = useRoute();

	return <GroupScreen />;
}
