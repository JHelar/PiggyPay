import { TextInput as RNTextInput } from "react-native";
import { FormFieldInput } from "../FormField/FormField";
import { FieldValues, FieldPath } from "react-hook-form";

type TextInputProps<
	TFieldValues extends FieldValues = FieldValues,
	TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> = FormFieldInput<TFieldValues, TName>;

export function TextInput<
	TFieldValues extends FieldValues = FieldValues,
	TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({ field }: TextInputProps<TFieldValues, TName>) {
	return <RNTextInput />;
}
