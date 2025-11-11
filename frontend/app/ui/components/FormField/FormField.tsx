import { renderSlot, RenderSlot } from "@/ui/utils/renderSlot";
import {
	ControllerFieldState,
	ControllerRenderProps,
	FieldPath,
	FieldValues,
	useController,
	UseControllerProps,
	UseFormStateReturn,
} from "react-hook-form";
import { View } from "react-native";
import { Text } from "../Text";
import { StyleSheet } from "react-native-unistyles";

export type FormFieldInput<
	TFieldValues extends FieldValues = FieldValues,
	TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> = {
	field: ControllerRenderProps<TFieldValues, TName>;
	fieldState: ControllerFieldState;
	formState: UseFormStateReturn<TFieldValues>;
};

type FormFieldProps<
	TFieldValues extends FieldValues = FieldValues,
	TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
	TTransformedValues = TFieldValues,
> = {
	label: string;
	input: RenderSlot<FormFieldInput<TFieldValues, TName>>;
} & UseControllerProps<TFieldValues, TName, TTransformedValues>;

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
			<Text variant="small">{label}</Text>
			{Input}
			{fieldState.error && (
				<Text variant="small">{fieldState.error.message}</Text>
			)}
		</View>
	);
}

const styles = StyleSheet.create((theme) => ({
	container: {
		rowGap: theme.gap(1),
	},
}));
