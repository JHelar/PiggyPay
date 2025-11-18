import { zodResolver } from "@hookform/resolvers/zod";
import { focusManager, useMutation } from "@tanstack/react-query";
import { useCallback } from "react";
import { useForm } from "react-hook-form";
import { View } from "react-native";
import Animated, { FadeOut } from "react-native-reanimated";
import { StyleSheet } from "react-native-unistyles";
import { z } from "zod";
import { createUser, signIn, verifyCode } from "@/api/user";
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

	const email = useSignInStore(
		({ statePayload }) => statePayload.EmailSubmit?.email,
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

function CreateUser() {
	const { mutateAsync, isPending } = useMutation(createUser());

	const form = useForm({
		resolver: zodResolver(
			z.object({
				firstName: z.string(),
				lastName: z.string(),
				phoneNumber: z.string(),
			}),
		),
	});

	const onSubmit = form.handleSubmit(async (formData) => {
		try {
			const user = await mutateAsync({
				first_name: formData.firstName,
				last_name: formData.lastName,
				phone_number: formData.phoneNumber,
			});

			useSignInStore.getState().transition("next", user);
		} catch (error) {
			useSignInStore.getState().transition("error");
		}
	});

	return (
		<View style={styles.container}>
			<Text variant="headline" containerStyles={styles.title}>
				Email verification
			</Text>
			{isPending && <Spinner />}
			{!isPending && (
				<Animated.View exiting={FadeOut.duration(250)}>
					<FormField
						control={form.control}
						label="First name"
						name="firstName"
						disabled
						input={
							<TextInput
								autoCapitalize="words"
								autoComplete="name-given"
								keyboardType="default"
								textContentType="givenName"
							/>
						}
					/>
					<FormField
						control={form.control}
						label="Last name"
						name="lastName"
						disabled
						input={
							<TextInput
								autoCapitalize="words"
								autoComplete="name-family"
								keyboardType="default"
								textContentType="familyName"
							/>
						}
					/>
					<FormField
						control={form.control}
						label="Phone number"
						name="phoneNumber"
						disabled
						input={
							<TextInput
								autoCapitalize="none"
								autoComplete="tel"
								keyboardType="phone-pad"
								textContentType="telephoneNumber"
							/>
						}
					/>
					<Button containerStyles={styles.submit} onPress={onSubmit}>
						Create
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
	if (state === "NewUser") return <CreateUser />;
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
