import {
	type FieldPath,
	type FieldValues,
	useController,
} from "react-hook-form";
import { View } from "react-native";
import { StyleSheet } from "react-native-unistyles";
import { renderSlot } from "@/ui/utils/renderSlot";
import { Text } from "../Text";
import type { FormFieldProps } from "./FormField.types";

export function FormField<
	TFieldValues extends FieldValues = FieldValues,
	TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
	TTransformedValues = TFieldValues,
>({
	label,
	input,
	control,
	name,
	defaultValue,
	disabled,
	rules,
	shouldUnregister,
}: FormFieldProps<TFieldValues, TName, TTransformedValues>) {
	const { field, fieldState, formState } = useController({
		name,
		control,
		defaultValue,
		disabled,
		rules,
		shouldUnregister,
	});

	const Input = renderSlot(input, { field, fieldState, formState });

	return (
		<View style={styles.container}>
			<Text variant="xsmall">{label}</Text>
			{Input}
			{fieldState.error && (
				<Text variant="small" style={styles.error}>
					{fieldState.error.message}
				</Text>
			)}
		</View>
	);
}

const styles = StyleSheet.create((theme) => ({
	container: {
		rowGap: theme.gap(1),
	},
	error: {
		color: theme.text.color.error,
	},
}));
