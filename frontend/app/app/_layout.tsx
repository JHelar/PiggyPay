import { i18n } from "@lingui/core";
import { I18nProvider } from "@lingui/react";
import {
	QueryClientProvider,
	useQueryErrorResetBoundary,
} from "@tanstack/react-query";
import { Stack } from "expo-router";
import { useUnistyles } from "react-native-unistyles";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { SnackbarRoot } from "@/components/SnackbarRoot";
import { queryClient } from "@/query";

export default function AppLayout() {
	const { reset } = useQueryErrorResetBoundary();
	const { theme } = useUnistyles();
	console.log("Theme", theme.background.primary);
	return (
		<QueryClientProvider client={queryClient}>
			<I18nProvider i18n={i18n}>
				<ErrorBoundary queryReset={reset}>
					<Stack
						screenOptions={{ headerShown: false, presentation: "modal" }}
					/>
					<SnackbarRoot />
				</ErrorBoundary>
			</I18nProvider>
		</QueryClientProvider>
	);
}
