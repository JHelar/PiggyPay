import Animated, { SlideInDown, SlideOutDown } from "react-native-reanimated";
import { StyleSheet } from "react-native-unistyles";
import { Snackbar } from "@/ui/components/Snackbar";
import { useSnackbar } from "./SnackbarRoot.store";

export function SnackbarRoot() {
	const snackBar = useSnackbar(({ current }) => current);
	if (snackBar === undefined) return;

	return (
		<Animated.View
			key={snackBar.id}
			entering={SlideInDown.duration(500)}
			exiting={SlideOutDown.duration(500)}
			style={styles.container}
		>
			<Snackbar {...snackBar} />
		</Animated.View>
	);
}

const styles = StyleSheet.create((theme, rt) => ({
	container: {
		position: "absolute",
		bottom: rt.insets.bottom,
		left: theme.gap(2) + rt.insets.left,
		right: theme.gap(2) + rt.insets.right,
	},
}));
