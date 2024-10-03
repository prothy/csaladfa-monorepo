<script lang="ts">
  import { onMount } from 'svelte';
  import { buildGraph } from '$lib/modules/parser';
  import dTree from '$lib/dtree/dtree';
  import './tree.css';

  let graphContainer: HTMLDivElement;

  onMount(() => {
    const graph = buildGraph();

    dTree.init(graph, {
      target: graphContainer,
      debug: true,
      height: 800,
      width: 1200,
    });
  });
</script>

<main>
  <div bind:this={graphContainer}></div>
</main>
