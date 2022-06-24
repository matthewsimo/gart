<script lang="ts">
	export let title: string;
	export let value: boolean;
</script>

<div class="form-control w-full max-w-xs">
	<label class="label cursor-pointer">
		<span class="label-text">{title}</span>
		<input type="checkbox" bind:checked={value} class="checkbox" />
	</label>
</div>
