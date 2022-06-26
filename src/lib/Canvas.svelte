<script lang="ts" context="module">
	export type SetupParams = {
		context: CanvasRenderingContext2D;
	};

	export type RunParams = SetupParams & {
		settings: {
			size: number;
		};
	};

	export type ClearParams = RunParams;

	export type KeyboardHandlers = Record<string, () => void>;
</script>

<script lang="ts">
	import { browser } from '$app/env';
	import { onDestroy, onMount } from 'svelte';

	import { noOp } from '$lib/gart';

	export let title: string = 'composition';
	export let animate: boolean = false;
	export let setup: (params: SetupParams) => void = noOp;
	export let run: (params: RunParams) => void = noOp;
	export let clear: (params: ClearParams) => void = noOp;
	export let keyboardHandlers: KeyboardHandlers = {};

	const defaultHandlers: KeyboardHandlers = {
		KeyC: () => clear({ context, settings: { size } }),
		KeyR: () => clearAndRun(),
		KeyP: () => {
			const link = document.createElement('a');
			link.download = `${title}.png`;
			link.href = canvas.toDataURL();
			link.click();
			link.remove();
		},
		Space: () => {
			isPaused = !isPaused;
			clearAndRun();
		}
	};

	$: allHandlers = { ...defaultHandlers, ...keyboardHandlers };

	let canvas: HTMLCanvasElement;
	let context: CanvasRenderingContext2D;
	let size: number;

	let isPaused: boolean = false;
	let finishedSetup: boolean = false;

	const handleKeydown = (e: KeyboardEvent) => {
		console.log({ code: e.code });
		for (const handler in allHandlers) {
			if (e.code === handler) {
				allHandlers[handler]();
			}
		}
	};

	let raf: number;

	const clearAndRun = () => {
		if (animate && !isPaused) {
			raf = requestAnimationFrame(clearAndRun);
		}
		clear({ context, settings: { size } });
		run({ context, settings: { size } });
	};

	const resize = () => {
		const { width } = canvas.getBoundingClientRect();
		size = width;
		const dpr = window.devicePixelRatio;
		canvas.width = size * dpr;
		canvas.height = size * dpr;
		context?.scale(dpr, dpr);
	};

	onMount(() => {
		const ctx = canvas.getContext('2d');
		if (!ctx) {
			throw new Error("Couldn't find Canvas Context");
		} else {
			context = ctx;
		}

		resize();

		finishedSetup = true;
		setup({ context });

		if (animate) {
			raf = requestAnimationFrame(clearAndRun);
		}

		window.addEventListener('resize', resize);
	});

	onDestroy(() => {
		if (raf) {
			cancelAnimationFrame(raf);
		}

		if (browser) {
			window.removeEventListener('resize', resize);
		}
	});

	$: {
		if (finishedSetup) {
			run({ context, settings: { size } });
		}
	}
</script>

<svelte:window on:keydown={handleKeydown} />

<canvas class="w-full h-full aspect-square " bind:this={canvas} on:click={clearAndRun} />
