import {
	Group,
	Path,
	type PublicGroupProps,
	type SkiaProps,
} from "@shopify/react-native-skia";

export function LeftEyebrow(props: SkiaProps<PublicGroupProps>) {
	return (
		<Group {...props}>
			<Path
				path="M170.63 81.925C173.273 82.3172 176.108 83.0484 175.916 82.8059C174.725 80.6763 173.909 80.2601 172.089 79.687C169.383 79.116 168.543 81.6154 170.63 81.925Z"
				style="fill"
				color="#83413E"
			/>
			<Path
				path="M170.63 81.925C173.273 82.3172 176.108 83.0484 175.916 82.8059C174.725 80.6763 173.909 80.2601 172.089 79.687C169.383 79.116 168.543 81.6154 170.63 81.925Z"
				color="#814F4D"
				style="stroke"
				strokeWidth={0.6}
			/>
		</Group>
	);
}
