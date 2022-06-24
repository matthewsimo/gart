<script lang="ts">
	export let min: number;
	export let max: number;
	export let value: number;
	export let step: number;
	export let title: string = 'Range Title';
  export let withTicks: boolean = false;
	$: id = title.toLowerCase().split(' ').join('-');

  const getNumberOfTicks = (min: number, max: number, step: number): number => {
    let ticksNum = 0;

    for(let i = min; i <= max; i = i + step) {
      ticksNum++;
    }
    
    return ticksNum;
  };

  $: numberOfTicks = withTicks ? getNumberOfTicks(min, max, step) : 0; 
</script>

<div class="form-control w-full max-w-xs">
	<label class="label" for={id}>
		<span class="label-text">{title}</span>
	</label>
	<input {id} type="range" {min} {max} bind:value class="range" {step} />

  {#if withTicks}
  <div class="w-full flex justify-between text-xs px-2">
    {#each [...new Array(numberOfTicks)] as _ }
    <span>|</span>
    {/each}
  </div>
  {/if}
</div>
