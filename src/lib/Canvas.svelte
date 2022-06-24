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

	const noOp = () => {};

	export let animate: boolean = false;
	export let setup: (params: SetupParams) => void = noOp;
	export let run: (params: RunParams) => void = noOp;
	export let clear: (params: ClearParams) => void = noOp;

	const defaultHandlers: KeyboardHandlers = {
		Space: () => clear({ context, settings: { size } }),
		KeyR: () => clearAndRun(),
		Escape: () => (isOpen = !isOpen)
	};
	export let keyboardHandlers: KeyboardHandlers;

	$: allHandlers = { ...defaultHandlers, ...keyboardHandlers };

	let canvas: HTMLCanvasElement;
	let context: CanvasRenderingContext2D;
	let size: number;

	let finishedSetup: boolean = false;

	const handleKeydown = (e: KeyboardEvent) => {
		for (const handler in allHandlers) {
			if (e.code === handler) {
				allHandlers[handler]();
			}
		}
	};

	let raf: number;

	const clearAndRun = () => {
		if (animate) {
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
		context = canvas.getContext('2d') as CanvasRenderingContext2D;
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

	let hasGUI = $$slots.default;
	let isOpen: boolean = false;
</script>

<svelte:window on:keydown={handleKeydown} />

<div class="drawer drawer-end">
	<input id="my-drawer-4" type="checkbox" class="drawer-toggle" bind:checked={isOpen} />
	<div class="drawer-content">
		<div
			class="mx-auto max-w-7xl h-full w-11/12 grid grid-cols-1 grid-rows-1 py-6 md:py-10 lg:py-12 xl:py-16"
		>
			<div
				class="w-full max-h-full aspect-square bg-white relative rounded-sm overflow-hidden shadow-page place-self-center"
			>
				<canvas class="w-full max-h-full aspect-square" bind:this={canvas} on:click={clearAndRun} />
			</div>
			{#if hasGUI}
				<label
					for="my-drawer-4"
					class="drawer-button btn btn-sm btn-circle btn-primary shadow-md absolute top-12 right-12"
				>
					<span class="sr-only">Open GUI Drawer</span>
					<svg
						width="24"
						height="24"
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						viewBox="0 0 24 24"
						class="w-5 h-5 stroke-current"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"
						/>
					</svg>
				</label>
			{/if}
		</div>
	</div>
	<div class="drawer-side">
		<label for="my-drawer-4" class="drawer-overlay" />
		<div
			class="flex flex-col items-start p-5 space-y-6 overflow-y-auto w-80 bg-base-100 text-base-content"
		>
			<label for="my-drawer-4" class="self-end btn btn-sm btn-outline mb-5"
				>Close
				<svg
					class="fill-current w-5 h-5"
					xmlns="http://www.w3.org/2000/svg"
					width="24"
					height="24"
					viewBox="0 0 512 512"
				>
					<polygon
						points="400 145.49 366.51 112 256 222.51 145.49 112 112 145.49 222.51 256 112 366.51 145.49 400 256 289.49 366.51 400 400 366.51 289.49 256 400 145.49"
					/>
				</svg>
			</label>
			<slot />
		</div>
	</div>
</div>
