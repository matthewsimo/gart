<script lang="ts">
	import Canvas from '$lib/Canvas.svelte';
	import type { RunParams, ClearParams } from '$lib/Canvas.svelte';

	import GUI from '$lib/GUI/GUI.svelte';
	import Input from '$lib/GUI/Input.svelte';
	import Range from '$lib/GUI/Range.svelte';

	import { pRand } from '$lib/pRand';

	let seed: number | string = Date.now();
	$: console.log({ seed });

	const keyboardHandlers = {
		KeyS: () => (seed = Date.now())
	};

	let strokeWidth: number = 10;
	let step: number = 15;
	let invert: boolean = false;

	function draw(
		context: RunParams['context'],
		x: number,
		y: number,
		width: number,
		height: number,
		leftToRight: boolean
	) {
		if (leftToRight) {
			context.moveTo(x, y);
			context.lineTo(x + width, y + height);
		} else {
			context.moveTo(x + width, y);
			context.lineTo(x, y + height);
		}
	}

	const run = ({ context, settings }: RunParams) => {
		const { size } = settings;
		const getRandom = pRand(seed);

		context.strokeStyle = invert ? 'white' : 'black';
		context.lineCap = 'square';
		context.beginPath();
		context.lineWidth = strokeWidth;

		for (let x = 0; x < size; x += step) {
			for (let y = 0; y < size; y += step) {
				draw(context, x, y, step, step, getRandom.next().value % 2 === 1);
			}
		}

		context.stroke();
	};

	const clear = ({ context, settings }: ClearParams) => {
		const { size } = settings;
		context.clearRect(0, 0, size, size);
		context.fillStyle = invert ? 'black' : 'white';
		context.fillRect(0, 0, size, size);
	};
</script>

<Canvas {run} {clear} {keyboardHandlers} animate>
	<GUI>
		<Input title="Seed" bind:value={seed} />
		<Range title="Stroke Width" min={2} max={13} bind:value={strokeWidth} step={1} withTicks />
		<Range title="Step Size" min={10} max={100} bind:value={step} step={5} />
	</GUI>
</Canvas>
