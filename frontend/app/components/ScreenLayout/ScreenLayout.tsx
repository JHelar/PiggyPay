import { useHeaderHeight } from "@react-navigation/elements";
import { type PropsWithChildren, Suspense } from "react";
import { StyleSheet } from "react-native-unistyles";
import {
	ScreenContent,
	type ScreenContentProps,
} from "@/ui/components/ScreenContent";
import { Spinner } from "@/ui/components/Spinner";

export function ScreenLayout({
	children,
	variant,
	footer,
}: PropsWithChildren<Pick<ScreenContentProps, "variant" | "footer">>) {
	const headerHeight = useHeaderHeight();
	return (
		<ScreenContent
			variant={variant}
			footer={footer}
			style={styles.header(headerHeight, variant)}
		>
			<Suspense fallback={<Spinner />}>{children}</Suspense>
		</ScreenContent>
	);
}

const styles = StyleSheet.create((theme) => ({
	header(headerHeight: number, variant: ScreenContentProps["variant"]) {
		return {
			paddingTop: theme.gap(variant === "primary" ? 1 : 6) + headerHeight,
		};
	},
}));
