<script lang="ts">
	import Gart from '$lib/Gart.svelte';
	import type { RunParams, ClearParams } from '$lib/Canvas.svelte';

	import GUI from '$lib/GUI/GUI.svelte';
	import Seed from '$lib/GUI/Seed.svelte';
	import Range from '$lib/GUI/Range.svelte';
	import Checkbox from '$lib/GUI/Checkbox.svelte';

	import { constrainRand, getSeed, randomGenerator } from '$lib/gart';

	import Colors from '$lib/colors';
	import Select from '$lib/GUI/Select.svelte';

	let seed: number = getSeed();
	$: console.log({ seed });
	const regenSeed = () => (seed = getSeed());

	const keyboardHandlers = {
		KeyS: () => regenSeed()
	};

	let radiusMin: number = 0;
	let radiusMax: number = 30;
	let strokeMin: number = 0;
	let strokeMax: number = 0;
	let step: number = 20;
	let invert: boolean = false;
	let theme: keyof typeof Colors = 'Zissou2';

	$: colors = Colors[theme];

	console.log({ theme, colors });

	function draw(context: RunParams['context'], x: number, y: number, r: number) {
		context.moveTo(x, y);
		context.arc(x, y, r, 0, 2 * Math.PI);
	}

	const run = ({ context, settings }: RunParams) => {
		const { size } = settings;
		const getRandom = randomGenerator(seed);
		type Layers = {
			fillStyle: string;
			strokeStyle: string;
			lineWidth: number;
			dots: { x: number; y: number; r: number }[];
		}[];
		const layers: Layers = [];

		for (let i = 0; i < 4; i++) {
			layers.push({
				fillStyle: colors[getRandom.next().value % 5],
				strokeStyle:
					strokeMin === 0 && strokeMax === 0 ? 'transparent' : colors[getRandom.next().value % 5],
				lineWidth: constrainRand(getRandom.next().value, strokeMin, strokeMax),
				dots: []
			});
		}

		context.lineCap = 'round';

		// context.beginPath();
		// context.fillStyle = color1;
		// context.arc(500, 500, 20, 0, 2 * Math.PI);
		// context.stroke();
		// context.fill();

		// context.beginPath();
		// context.fillStyle = color2;
		// context.arc(670, 600, 20, 0, 2 * Math.PI);
		// context.stroke();
		// context.fill();

		for (let x = 0; x < size; x += step) {
			for (let y = 0; y < size; y += step) {
				const layer = getRandom.next().value % 4;
				const rand = getRandom.next().value;
				layers[layer].dots.push({ x, y, r: constrainRand(rand, radiusMin, radiusMax) });
			}
		}

		for (let i = 0; i < 4; i++) {
			const { dots, fillStyle, strokeStyle, lineWidth } = layers[i];

			context.beginPath();
			context.fillStyle = fillStyle;
			context.strokeStyle = strokeStyle;
			context.lineWidth = lineWidth;

			for (let j = 0; j < dots.length; j++) {
				const { x, y, r } = dots[j];
				draw(context, x, y, r);
			}

			context.stroke();
			context.fill();
		}
	};

	const clear = ({ context, settings }: ClearParams) => {
		const { size } = settings;
		context.clearRect(0, 0, size, size);
		context.fillStyle = invert ? 'black' : 'white';
		context.fillRect(0, 0, size, size);
	};
</script>

<Gart title={`dots-${seed}`} {run} {clear} {keyboardHandlers} animate>
	<GUI>
		<Seed title="Seed" bind:value={seed} regen={regenSeed} />
		<Select
			title="Theme"
			bind:value={theme}
			description="Pick a color theme"
			options={Object.keys(Colors)}
		/>

		<Range title="Stroke Min" min={0} max={strokeMax} bind:value={strokeMin} step={1} />
		<Range title="Stroke Max" min={strokeMin} max={10} bind:value={strokeMax} step={1} />
		<Range title="Radius Min" min={0} max={20} bind:value={radiusMin} step={1} />
		<Range title="Radius Max" min={21} max={50} bind:value={radiusMax} step={1} />
		<Range title="Step Size" min={10} max={100} bind:value={step} step={5} />
		<Checkbox title="Invert" bind:value={invert} />
	</GUI>
</Gart>
