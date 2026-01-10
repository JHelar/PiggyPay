import { zodResolver } from "@hookform/resolvers/zod";
import { Trans } from "@lingui/react/macro";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { View } from "react-native";
import Animated, { FadeOut } from "react-native-reanimated";
import { StyleSheet } from "react-native-unistyles";
import z from "zod";
import { createUser } from "@/api/user";
import { Button } from "@/ui/components/Button";
import { FormField } from "@/ui/components/FormField";
import { Spinner } from "@/ui/components/Spinner";
import { Text } from "@/ui/components/Text";
import { TextInput } from "@/ui/components/TextInput";
import { useSignInStore } from "../SignIn.store";

export function CreateUser() {
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
		const sessionId =
			useSignInStore.getState().statePayload.VerifyCode?.sessionId;
		if (sessionId === undefined) return;

		try {
			const user = await mutateAsync({
				first_name: formData.firstName,
				last_name: formData.lastName,
				phone_number: formData.phoneNumber,
				sessionId,
			});

			useSignInStore.getState().transition("next", {
				user,
			});
		} catch {
			useSignInStore.getState().transition("error");
		}
	});

	return (
		<View style={styles.container}>
			<Text variant="headline" style={styles.heading}>
				<Trans>New user</Trans>
			</Text>
			{isPending && <Spinner />}
			{!isPending && (
				<Animated.View exiting={FadeOut.duration(250)} style={styles.content}>
					<FormField
						control={form.control}
						label="First name"
						name="firstName"
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
						input={
							<TextInput
								autoCapitalize="none"
								autoComplete="tel"
								keyboardType="phone-pad"
								textContentType="telephoneNumber"
							/>
						}
					/>
					<Button onPress={onSubmit}>
						<Trans>Create</Trans>
					</Button>
				</Animated.View>
			)}
		</View>
	);
}

const styles = StyleSheet.create((theme) => ({
	container: {
		flex: 1,
		rowGap: theme.gap(6),
	},
	heading: {
		textAlign: "center",
	},
	content: {
		flex: 1,
		rowGap: theme.gap(2),
	},
}));
