import type {
	ControllerFieldState,
	ControllerRenderProps,
	FieldPath,
	FieldValues,
	UseControllerProps,
	UseFormStateReturn,
} from "react-hook-form";
import type { RenderSlot } from "@/ui/utils/renderSlot";

export type FormFieldInput<
	TFieldValues extends FieldValues = FieldValues,
	TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> = Partial<{
	field: ControllerRenderProps<TFieldValues, TName>;
	fieldState: ControllerFieldState;
	formState: UseFormStateReturn<TFieldValues>;
}>;

export type FormFieldProps<
	TFieldValues extends FieldValues = FieldValues,
	TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
	TTransformedValues = TFieldValues,
> = {
	label: string;
	input: RenderSlot<FormFieldInput<TFieldValues, TName>>;
} & UseControllerProps<TFieldValues, TName, TTransformedValues>;
