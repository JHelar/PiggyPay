export function curve(progress: number, frequency: number, amplitude: number) {
	"worklet";
	return amplitude * (0.5 * (Math.sin(2 * Math.PI * frequency * progress) + 1));
}
