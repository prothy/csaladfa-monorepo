<script lang="ts">
  import { onMount } from 'svelte';
  import { buildGraph } from '$lib/modules/parser';
  import dTree from 'd3-dtree';

  let canvasContainer: HTMLDivElement;

  onMount(() => {
    const graph = buildGraph();

    const tree = dTree.init(graph);
  });
</script>

<main>
  <div bind:this={canvasContainer}></div>
</main>
