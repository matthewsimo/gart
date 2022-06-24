<script lang="ts">
	import { onMount } from 'svelte';

	export let title: string;
	export let value: string | number;

	let input: HTMLInputElement;

	const handleFocus = (e: FocusEvent) => {
		console.log(`Implement this! ${value}`, { e });
	};

	onMount(() => {
		input.addEventListener('focus', handleFocus);
		return () => input.removeEventListener('focus', handleFocus);
	});
</script>

<div class="form-control">
	<label class="input-group">
		<span>{title}</span>
		<input
			type="text"
			bind:value
			bind:this={input}
			placeholder="Type here"
			class="input input-bordered w-full max-w-xs"
		/>
	</label>
</div>
