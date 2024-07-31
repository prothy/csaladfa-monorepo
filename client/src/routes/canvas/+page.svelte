<script lang="ts">
  import { onMount } from 'svelte';
  import Controller from '$lib/modules/view/controller';
  import { buildGraph } from '$lib/modules/parser';

  let canvasContainer: HTMLDivElement;

  onMount(() => {
    Controller.init(canvasContainer, (event) => {
      console.log(event);
    });

    return () => Controller.destroy();
  });
</script>

<main>
  <div bind:this={canvasContainer}></div>
</main>
