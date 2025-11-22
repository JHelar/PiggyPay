import type { FieldPath, FieldValues } from "react-hook-form";
import {
	TextInput as RNTextInput,
	type TextInputProps as RNTextInputProps,
} from "react-native";
import { StyleSheet } from "react-native-unistyles";
import type { FormFieldInput } from "../FormField/FormField";

type TextInputProps<
	TFieldValues extends FieldValues = FieldValues,
	TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> = RNTextInputProps & FormFieldInput<TFieldValues, TName>;

export function TextInput<
	TFieldValues extends FieldValues = FieldValues,
	TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({
	field,
	fieldState,
	formState,
	...inputProps
}: TextInputProps<TFieldValues, TName>) {
	return (
		<RNTextInput
			onChangeText={field?.onChange}
			{...field}
			{...inputProps}
			style={styles.input}
			accessibilityState={{
				disabled: formState?.disabled,
			}}
		/>
	);
}

const styles = StyleSheet.create((theme) => ({
	input: {
		backgroundColor: theme.input.background,
		borderRadius: theme.radius.medium,
		color: theme.text.color.default,
		borderColor: theme.border.primary,
		borderWidth: 1,
		height: 52,
		alignContent: "center",
		alignItems: "center",
		paddingHorizontal: theme.gap(2),
		...theme.typography.body,
	},
}));
