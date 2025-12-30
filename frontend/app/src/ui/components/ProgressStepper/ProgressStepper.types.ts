import type { Extendable } from "@/ui/ui.types";

export type ProgressStepperProps = {
	totalSteps: number;
	currentStep: number;
} & Extendable;

export type ProgressStepProps = {
	active: boolean;
};
