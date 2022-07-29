<script lang="ts">
	import type { RunParams, ClearParams } from '$lib/Canvas.svelte';

	import Gart from '$lib/Gart.svelte';
	import GUI from '$lib/GUI/GUI.svelte';
	import Seed from '$lib/GUI/Seed.svelte';
	import Range from '$lib/GUI/Range.svelte';
	import Checkbox from '$lib/GUI/Checkbox.svelte';

	let strokeWidth: number = 1;
	let iterations: number = 8;
	let length: number = 2;
	let angle: number = 22;
	let invert: boolean = false;

	type ValidChar = 'F' | 'X' | '+' | '-' | '[' | ']';
	const rules: Record<ValidChar, ValidChar[]> = {
		X: ['F', '+', '[', '[', 'X', ']', '-', 'X', ']', '-', 'F', '[', '-', 'F', 'X', ']', '+', 'X'],
		F: ['F', 'F'],
		'+': ['+'],
		'-': ['-'],
		'[': ['['],
		']': [']']
	};

	const genWord = (iterations: number): ValidChar[] => {
		let word: ValidChar[] = ['X'];

		for (let x = 0; x < iterations; x++) {
			let nextWord: ValidChar[] = [];

			for (let i = 0; i < word.length; i++) {
				const newCommands = rules[word[i]];
				nextWord.push(...newCommands);
			}

			word = nextWord;
		}
		return word;
	};

	$: word = genWord(iterations);

	const run = ({ context, settings }: RunParams) => {
		const { size } = settings;

		context.strokeStyle = invert ? 'white' : 'black';
		context.lineCap = 'round';
		context.lineWidth = strokeWidth;
		context.beginPath();

		context.save();
		context.translate(size / 4, size);
		context.rotate((Math.PI / 180) * angle);
		context.lineTo(0, 0);

		const drawRules: Record<ValidChar, () => void> = {
			F: (): void => {
				context.lineTo(0, -length);
				context.translate(0, -length);
			},
			'+': (): void => {
				context.rotate((Math.PI / 180) * -angle);
			},
			'-': (): void => {
				context.rotate((Math.PI / 180) * angle);
			},
			'[': (): void => {
				context.save();
			},
			']': (): void => {
				context.restore();
				context.moveTo(0, 0);
			},
			X: (): void => {
				return;
			}
		};

		// console.log(`word:`, word);
		for (let x = 0; x < word.length; x++) {
			const command: ValidChar = word[x];
			drawRules[command]();
		}
		context.restore();
		context.moveTo(0, 0);

		context.stroke();
		context.setTransform(1, 0, 0, 1, 0, 0);
	};

	const clear = ({ context, settings }: ClearParams) => {
		const { size } = settings;
		context.clearRect(0, 0, size, size);
		context.fillStyle = invert ? 'black' : 'white';
		context.fillRect(0, 0, size, size);
	};
</script>

<Gart title={`lsys-${strokeWidth}-${iterations}-${length}-${angle}-${invert}`} {run} {clear}>
	<GUI>
		<Range title="Stroke Width" min={1} max={10} bind:value={strokeWidth} step={1} withTicks />
		<Range title="Iterations" min={1} max={8} bind:value={iterations} step={1} />
		<Range title="Length" min={1} max={100} bind:value={length} step={1} />
		<Range title="Angle" min={-90} max={90} bind:value={angle} step={5} />
		<Checkbox title="Invert" bind:value={invert} />
	</GUI>
</Gart>
