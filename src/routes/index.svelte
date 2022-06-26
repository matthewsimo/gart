<script lang="ts">
	import type { RunParams, ClearParams } from '$lib/Canvas.svelte';

	import Gart from '$lib/Gart.svelte';
	import GUI from '$lib/GUI/GUI.svelte';
	import Seed from '$lib/GUI/Seed.svelte';
	import Range from '$lib/GUI/Range.svelte';
	import Checkbox from '$lib/GUI/Checkbox.svelte';

	import { getSeed, randomGenerator } from '$lib/gart';

	let seed: number = getSeed();
	$: console.log({ seed });
	const regenSeed = () => (seed = getSeed());

	const keyboardHandlers = {
		KeyS: () => regenSeed()
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
		const getRandom = randomGenerator(seed);

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

<Gart title={`demo-${seed}`} {run} {clear} {keyboardHandlers} animate>
	<GUI>
		<Seed title="Seed" bind:value={seed} regen={regenSeed} />
		<Range title="Stroke Width" min={2} max={13} bind:value={strokeWidth} step={1} withTicks />
		<Range title="Step Size" min={10} max={100} bind:value={step} step={5} />
		<Checkbox title="Invert" bind:value={invert} />
	</GUI>
</Gart>
