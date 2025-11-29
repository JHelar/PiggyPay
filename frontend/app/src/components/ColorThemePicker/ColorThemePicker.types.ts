import type { FieldPath, FieldValues } from "react-hook-form";
import type { FormFieldInput } from "@/ui/components/FormField";

export type ColorThemePickerProps<
	TFieldValues extends FieldValues = FieldValues,
	TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> = FormFieldInput<TFieldValues, TName>;
