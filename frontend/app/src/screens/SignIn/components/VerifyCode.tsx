import { zodResolver } from "@hookform/resolvers/zod";
import { Trans } from "@lingui/react/macro";
import { useMutation } from "@tanstack/react-query";
import { useCallback } from "react";
import { useForm } from "react-hook-form";
import { View } from "react-native";
import Animated, { FadeOut } from "react-native-reanimated";
import { StyleSheet } from "react-native-unistyles";
import z from "zod";
import { verifyCode } from "@/api/user";
import { Button } from "@/ui/components/Button";
import { FormField } from "@/ui/components/FormField";
import { Spinner } from "@/ui/components/Spinner";
import { Text } from "@/ui/components/Text";
import { TextInput } from "@/ui/components/TextInput";
import { useSignInStore } from "../SignIn.store";

export function VerifyCode() {
	const { mutateAsync, isPending } = useMutation(verifyCode());

	const form = useForm({
		resolver: zodResolver(
			z.object({
				code: z.coerce.number().min(10000).max(99999),
			}),
		),
	});

	const email = useSignInStore(
		({ statePayload }) => statePayload.EmailSubmit?.email,
	);

	const onSubmit = form.handleSubmit(async (formData) => {
		if (email === undefined) {
			useSignInStore.getState().transition("error");
			return;
		}

		try {
			const { new_user, session } = await mutateAsync({
				code: formData.code,
				email,
			});

			useSignInStore.getState().transition("next", {
				newUser: new_user,
				sessionId: session,
			});
		} catch {
			useSignInStore.getState().transition("error");
		}
	});

	const onChangeEmail = useCallback(() => {
		useSignInStore.getState().transition("back");
	}, []);

	return (
		<View style={styles.container}>
			<Text variant="headline" style={styles.heading}>
				<Trans>Verify</Trans>
			</Text>
			{isPending && <Spinner />}
			{!isPending && (
				<Animated.View style={styles.content} exiting={FadeOut.duration(250)}>
					<Text variant="body" style={styles.helpText}>
						<Trans>An email with code has been sent to {email}</Trans>
					</Text>
					<FormField
						control={form.control}
						label="Email code"
						name="code"
						input={
							<TextInput
								autoCapitalize="none"
								autoComplete="one-time-code"
								keyboardType="numeric"
								textContentType="oneTimeCode"
							/>
						}
					/>
					<Button onPress={onSubmit}>
						<Trans>Submit</Trans>
					</Button>
					<Button variant="ghost" onPress={onChangeEmail}>
						<Trans>Change email</Trans>
					</Button>
				</Animated.View>
			)}
		</View>
	);
}

const styles = StyleSheet.create((theme) => ({
	container: {
		flex: 1,
		rowGap: theme.gap(4),
	},
	heading: {
		textAlign: "center",
	},
	helpText: {
		marginBottom: theme.gap(2),
	},
	content: {
		flex: 1,
		rowGap: theme.gap(2),
	},
}));
