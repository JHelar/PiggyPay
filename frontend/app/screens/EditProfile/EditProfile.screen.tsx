import { zodResolver } from "@hookform/resolvers/zod";
import { useLingui } from "@lingui/react/macro";
import { use } from "react";
import { useForm } from "react-hook-form";
import { View } from "react-native";
import { StyleSheet } from "react-native-unistyles";
import z from "zod";
import { FormField } from "@/ui/components/FormField";
import { TextInput } from "@/ui/components/TextInput";
import type { EditProfileScreenProps } from "./EditProfile.types";

export function EditProfileScreen({ query }: EditProfileScreenProps) {
	const user = use(query.promise);
	const { t } = useLingui();

	const form = useForm({
		resolver: zodResolver(
			z.object({
				email: z.email(),
				firstName: z.string(),
				lastName: z.string(),
				phoneNumber: z.string(),
			}),
		),
		defaultValues: {
			email: user.email,
			firstName: user.first_name,
			lastName: user.last_name,
			phoneNumber: user.phone_number,
		},
	});

	return (
		<View style={styles.container}>
			<FormField
				control={form.control}
				label={t`First name`}
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
				label={t`Last name`}
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
				label={t`Phone number`}
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
			<FormField
				control={form.control}
				label={t`Email`}
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
		</View>
	);
}

const styles = StyleSheet.create((theme) => ({
	container: {
		rowGap: theme.gap(2),
	},
}));
