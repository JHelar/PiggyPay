import { i18n } from "@lingui/core";
import { I18nProvider } from "@lingui/react";
import {
	QueryClientProvider,
	useQueryErrorResetBoundary,
} from "@tanstack/react-query";
import { Stack } from "expo-router";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { SnackbarRoot } from "@/components/SnackbarRoot";
import { queryClient } from "@/query";

export default function AppLayout() {
	const { reset } = useQueryErrorResetBoundary();

	return (
		<GestureHandlerRootView>
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
		</GestureHandlerRootView>
	);
}
