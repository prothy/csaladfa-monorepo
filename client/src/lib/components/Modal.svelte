<script lang="ts">
  import { onMount } from 'svelte';

  export let data;

  let dialog: HTMLDialogElement;

  $: if (dialog && data) {
    dialog.showModal();
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
  class="modal right-modal"
>
  <!-- svelte-ignore a11y-no-static-element-interactions -->
  <div on:click|stopPropagation class="content">
    <button on:click={() => dialog.close()} class="close-button"> × </button>
    <slot>This is some modal text but there is no child component.</slot>
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
    animation: fadeIn 200ms ease-in;
  }

  .content {
    width: 40vw;
    height: 100%;
    background: white;

    padding: 2rem;
    border-radius: 4px;
    position: fixed;
    top: 0;
    right: 0;
    box-shadow: -2px 0 5px rgba(0, 0, 0, 0.5);
    z-index: 1000;

    animation: fadeIn 200ms ease-in;
  }

  .close-button {
    position: absolute;
    top: 1rem;
    right: 1rem;
    background: none;
    border: none;
    font-size: 1.5rem;
    cursor: pointer;
  }
  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
</style>
