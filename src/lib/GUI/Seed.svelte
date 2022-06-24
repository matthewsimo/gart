<script lang="ts">
	import { onMount } from 'svelte';

	export let title: string;
	export let value: number;
	export let regen: () => any | undefined;

	let input: HTMLInputElement;

	const handleFocus = (e: Event) => {
		input.select();
	};

	onMount(() => {
		input.addEventListener('focus', handleFocus);
		input.addEventListener('change', handleFocus);
		return () => {
			input.removeEventListener('focus', handleFocus);
			input.removeEventListener('change', handleFocus);
		};
	});
</script>

<div class="form-control w-full max-w-xs flex-row justify-between">
	<label class="input-group input-group-sm w-9/12">
		<span class="px-3">{title}</span>
		<input
			type="number"
			bind:value
			bind:this={input}
			placeholder="Type here"
			class="input input-bordered w-full max-w-xs px-3"
		/>
	</label>
	{#if regen}
		<button class="btn btn-outline btn-square" on:click|stopPropagation={regen}>
			<svg
				fill="currentColor"
				xmlns="http://www.w3.org/2000/svg"
				viewBox="0 0 24 24"
				width="24px"
				height="24px"
			>
				<path
					d="M 7.1601562 3 L 8.7617188 5 L 18 5 C 18.551 5 19 5.448 19 6 L 19 15 L 16 15 L 20 20 L 24 15 L 21 15 L 21 6 C 21 4.346 19.654 3 18 3 L 7.1601562 3 z M 4 4 L 0 9 L 3 9 L 3 18 C 3 19.654 4.346 21 6 21 L 16.839844 21 L 15.238281 19 L 6 19 C 5.449 19 5 18.552 5 18 L 5 9 L 8 9 L 4 4 z"
				/>
			</svg>
		</button>
	{/if}
</div>
