import {
	Group,
	Path,
	type PublicGroupProps,
	type SkiaProps,
} from "@shopify/react-native-skia";

export function RightEyebrow(props: SkiaProps<PublicGroupProps>) {
	return (
		<Group {...props}>
			<Path
				path="M140.903 85.7579C138.429 86.5468 134.452 90.2708 134.647 89.8238C134.918 87.081 135.851 85.7243 139.151 83.6308C141.912 82.6967 142.935 84.7542 140.903 85.7579Z"
				style="fill"
				color="#83413E"
			/>
			<Path
				path="M140.903 85.7579C138.429 86.5468 134.452 90.2708 134.647 89.8238C134.918 87.081 135.851 85.7243 139.151 83.6308C141.912 82.6967 142.935 84.7542 140.903 85.7579Z"
				color="#814F4D"
				style="stroke"
				strokeWidth={0.6}
			/>
		</Group>
	);
}
