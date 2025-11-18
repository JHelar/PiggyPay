import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useCallback } from "react";
import { useForm } from "react-hook-form";
import { View } from "react-native";
import Animated, { FadeOut } from "react-native-reanimated";
import { StyleSheet } from "react-native-unistyles";
import { z } from "zod";
import { signIn, verifyCode } from "@/api/user";
import { AuthState } from "@/auth";
import { authorize } from "@/auth/auth.store";
import { Button } from "@/ui/components/Button";
import { FormField } from "@/ui/components/FormField";
import { Spinner } from "@/ui/components/Spinner";
import { Text } from "@/ui/components/Text";
import { TextInput } from "@/ui/components/TextInput";
import { useSignInStore } from "./SignIn.store";

function EmailSubmit() {
	const { mutateAsync } = useMutation(signIn());
	const form = useForm({
		resolver: zodResolver(
			z.object({
				email: z.email({ error: "Email is required" }),
			}),
		),
	});

	const onSubmit = form.handleSubmit(async (formData) => {
		try {
			await mutateAsync(formData);
			useSignInStore.getState().transition("next", {
				state: AuthState.VERIFYING,
				email: formData.email,
			});
		} catch {
			useSignInStore.getState().transition("error");
		}
	});

	return (
		<View style={styles.container}>
			<Text variant="headline" containerStyles={styles.title}>
				Sign In
			</Text>
			<FormField
				control={form.control}
				label="Email"
				name="email"
				input={
					<TextInput
						autoCapitalize="none"
						autoComplete="email"
						keyboardType="email-address"
						textContentType="emailAddress"
					/>
				}
			/>
			<Button containerStyles={styles.submit} onPress={onSubmit}>
				Submit
			</Button>
		</View>
	);
}

function VerifyCode() {
	const { mutateAsync, isPending, error } = useMutation(verifyCode());

	const form = useForm({
		resolver: zodResolver(
			z.object({
				code: z.coerce.number().min(10000).max(99999),
			}),
		),
	});

	const email = useSignInStore(({ currentPayload }) =>
		currentPayload?.state === AuthState.VERIFYING
			? currentPayload.email
			: undefined,
	);

	const onSubmit = form.handleSubmit(async (formData) => {
		if (email === undefined) {
			useSignInStore.getState().transition("error");
			return;
		}

		try {
			console.log("Send", formData.code, email);
			const { new_user, session } = await mutateAsync({
				code: formData.code,
				email,
			});

			useSignInStore.getState().transition("next", {
				state: AuthState.AUTHORIZED,
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

	console.log("Verify", error, isPending);

	return (
		<View style={styles.container}>
			<Text variant="headline" containerStyles={styles.title}>
				Email verification
			</Text>
			<Text variant="small">Email with code sent to {email}</Text>
			{isPending && <Spinner />}
			{!isPending && (
				<Animated.View exiting={FadeOut.duration(250)}>
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
					<Button containerStyles={styles.submit} onPress={onSubmit}>
						Verify
					</Button>
					<Button
						variant="ghost"
						containerStyles={styles.submit}
						onPress={onChangeEmail}
					>
						Change email
					</Button>
				</Animated.View>
			)}
		</View>
	);
}

export function SignInScreen() {
	const state = useSignInStore(({ currentState }) => currentState);

	if (state === "EmailSubmit") return <EmailSubmit />;
	if (state === "VerifyCode") return <VerifyCode />;
}

const styles = StyleSheet.create((theme) => ({
	title: {
		textAlign: "center",
	},
	container: {
		flex: 1,
		justifyContent: "flex-start",
		rowGap: theme.gap(1.5),
	},
	submit: {
		marginTop: theme.gap(2.5),
	},
}));
