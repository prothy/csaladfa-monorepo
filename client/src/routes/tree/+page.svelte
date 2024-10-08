<script lang="ts">
  import { onMount } from 'svelte';
  import { buildGraph } from '$lib/modules/parser';
  import dTree from '$lib/dtree/dtree';
  import './tree.css';
  import { goto, preloadData, pushState } from '$app/navigation';
  import { page } from '$app/stores';
  import Modal from '$lib/components/Modal.svelte';

  let graphContainer: HTMLDivElement;

  onMount(async () => {
    const graph = await buildGraph();

    dTree.init(graph, {
      target: graphContainer,
      debug: true,
      height: 800,
      width: 1200,
      hideMarriageNodes: true,
      marriageNodeSize: 10,
      callbacks: {
        nodeClick: async function (name: string) {
          const result = await preloadData(`${location.pathname}/${name}`);

          if (result.type === 'loaded' && result.status === 200) {
            pushState(location.pathname, {
              data: result.data,
            });
          }
        },
      },
    });
  });
</script>

<main>
  <nav>
    <button></button>
  </nav>
  <div bind:this={graphContainer}></div>

  {#if $page.state.data}
    <Modal data={$page.state.data} >
      asdfasdf
    </Modal>
  {/if}
</main>
