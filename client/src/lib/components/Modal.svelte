<script lang="ts">
  import { onMount } from 'svelte';

  export let data;

  let dialog: HTMLDialogElement;

  $: if (dialog && data) {
    dialog.show()
  }

  onMount(() => {
    console.log(data);
  });
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
<dialog
  bind:this={dialog}
  on:close={() => {
    history.back();
    console.log('asdf');
  }}
  on:click|self={() => dialog.close()}
  class="modal"
>
  <!-- svelte-ignore a11y-no-static-element-interactions -->
  <div on:click|stopPropagation class="content">
    <slot>
      This is some modal text but there is no child component.
    </slot>
  </div>
</dialog>

<style>
  .modal {
    display: flex;
    justify-content: center;
    align-items: center;

    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.2);
    width: 100vw;
    height: 100vh;
  }

  .content {
    width: 30rem;
    height: 20rem;
    background: white;

    padding: 2rem;
    border-radius: 4px;
  }
</style>
