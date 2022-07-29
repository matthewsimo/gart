<script lang="ts">
	import { onMount } from 'svelte';

	export let title: string;
	export let description: string;
	export let value: string;
	export let options: string[];

	$: console.log({ value });

	$: id = title.toLowerCase().split(' ').join('-');
</script>

<div class="form-control w-full max-w-xs">
	<label class="label" for={id}>
		<span class="label-text">{title}</span>
	</label>
	<select {id} class="select select-bordered" bind:value>
		{#if description}
			<option disabled selected>{description}</option>
		{/if}
		{#each options as option}
			<option>{option}</option>
		{/each}
	</select>
</div>
