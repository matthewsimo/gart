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

	export let title: string = 'composition';
	export let animate: boolean = false;
	export let setup: (params: SetupParams) => void = noOp;
	export let run: (params: RunParams) => void = noOp;
	export let clear: (params: ClearParams) => void = noOp;

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
		Escape: () => (isOpen = !isOpen),
		Space: () => {
			isPaused = !isPaused;
			clearAndRun();
		}
	};
	export let keyboardHandlers: KeyboardHandlers;

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
				class="w-full max-w-5xl max-h-full aspect-square bg-white relative rounded-sm overflow-hidden shadow-page place-self-center"
			>
				<small class="text-sm text-neutral absolute bottom-3 left-3"
					><a
						href="https://github.com/matthewsimo/gart"
						target="_blank"
						class=" hover:top-px relative"
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							viewBox="0 0 512 512"
							class="inline-block h-5 w-5 fill-current shadow-sm bg-white rounded-full"
							><path
								d="M256,32C132.3,32,32,134.9,32,261.7c0,101.5,64.2,187.5,153.2,217.9a17.56,17.56,0,0,0,3.8.4c8.3,0,11.5-6.1,11.5-11.4,0-5.5-.2-19.9-.3-39.1a102.4,102.4,0,0,1-22.6,2.7c-43.1,0-52.9-33.5-52.9-33.5-10.2-26.5-24.9-33.6-24.9-33.6-19.5-13.7-.1-14.1,1.4-14.1h.1c22.5,2,34.3,23.8,34.3,23.8,11.2,19.6,26.2,25.1,39.6,25.1a63,63,0,0,0,25.6-6c2-14.8,7.8-24.9,14.2-30.7-49.7-5.8-102-25.5-102-113.5,0-25.1,8.7-45.6,23-61.6-2.3-5.8-10-29.2,2.2-60.8a18.64,18.64,0,0,1,5-.5c8.1,0,26.4,3.1,56.6,24.1a208.21,208.21,0,0,1,112.2,0c30.2-21,48.5-24.1,56.6-24.1a18.64,18.64,0,0,1,5,.5c12.2,31.6,4.5,55,2.2,60.8,14.3,16.1,23,36.6,23,61.6,0,88.2-52.4,107.6-102.3,113.3,8,7.1,15.2,21.1,15.2,42.5,0,30.7-.3,55.5-.3,63,0,5.4,3.1,11.5,11.4,11.5a19.35,19.35,0,0,0,4-.4C415.9,449.2,480,363.1,480,261.7,480,134.9,379.7,32,256,32Z"
							/></svg
						>
					</a></small
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
