<script lang="ts">
	import Canvas from './Canvas.svelte';
	import type { SetupParams, RunParams, ClearParams, KeyboardHandlers } from '$lib/Canvas.svelte';
	import LinkToSource from './LinkToSource.svelte';

	import { noOp } from '$lib/gart';

	export let title: string = 'composition';
	export let setup: (params: SetupParams) => void = noOp;
	export let run: (params: RunParams) => void = noOp;
	export let clear: (params: ClearParams) => void = noOp;
	export let keyboardHandlers: KeyboardHandlers = {};
	export let animate: boolean = false;

	let hasGUI = $$slots.default;
	let isOpen: boolean = false;

	const guiHandlers = {
		Escape: () => (isOpen = !isOpen)
	};

	$: allHandlers = hasGUI ? { ...guiHandlers, ...keyboardHandlers } : keyboardHandlers;
</script>

<div class="drawer drawer-end">
	<input id="drawer" type="checkbox" class="drawer-toggle" bind:checked={isOpen} />
	<div class="drawer-content">
		<div
			class="fixed inset-6 md:inset-12 lg:inset-16 mx-auto max-w-7xl grid grid-cols-1 grid-rows-1"
		>
			<div
				class="relative place-self-center landscape:w-auto landscape:h-full portrait:h-auto portrait:w-full shadow-page"
			>
				<LinkToSource />
				<Canvas {title} {setup} {run} {clear} {animate} keyboardHandlers={allHandlers} />
				{#if hasGUI}
					<label
						for="drawer"
						class="drawer-button btn btn-sm btn-circle btn-primary shadow-md absolute top-10 right-10"
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
	</div>
	<div class="drawer-side">
		<label for="drawer" class="drawer-overlay" />
		<div
			class="flex flex-col items-start p-5 space-y-6 overflow-y-auto w-80 bg-base-100 text-base-content"
		>
			<label for="drawer" class="self-end btn btn-sm btn-outline mb-5"
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
