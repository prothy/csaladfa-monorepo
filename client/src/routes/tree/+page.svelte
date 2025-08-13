<script lang="ts">
  import { onMount } from 'svelte';
  import { buildGraph } from '$lib/modules/parser';
  import dTree from '$lib/dtree/dtree';
  import './tree.css';
  import { goto, preloadData, pushState } from '$app/navigation';
  import { page } from '$app/stores';
  import Modal from '$lib/components/Modal.svelte';

  let graphContainer: HTMLDivElement;

  function initDTree(graph: any) {
    return dTree.init(graph, {
      target: graphContainer,
      debug: true,
      height: window.innerHeight,
      width: window.innerWidth,
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
  }

  let dtreeInstance: any;

  onMount(async () => {
    const graph = await buildGraph();
    dtreeInstance = initDTree(graph);

    const handleResize = () => {
      if (dtreeInstance) {
        graphContainer.removeChild(graphContainer.firstChild as Node);

        dtreeInstance = initDTree(graph);
      }
    };

    window.addEventListener('resize', handleResize);

    return (() => {
      window.removeEventListener('resize', handleResize);
    }) as never;
  });
</script>

<main>
  <nav>
    <button></button>
  </nav>
  <div bind:this={graphContainer} class="container" />

  {#if $page.state.data}
    <Modal data={$page.state.data}>asdfasdf</Modal>
  {/if}
</main>
