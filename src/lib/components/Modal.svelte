<script>
import { fade, scale } from "svelte/transition";

let { children, show = false } = $props();
</script>

{#if show}
  <div 
    role="button" 
    tabindex="-1" 
    transition:fade={{duration: 200}}
    class="fixed inset-0 z-40 bg-scrim/60 backdrop-blur-sm" 
    onclick={() => show = false}
    onkeyup={(e) => e.key === 'Escape' && (show = false)}
  ></div>

  <dialog 
    open 
    transition:scale={{duration: 200}}
    class="fixed w-[80%] md:w-[50%] top-1/2 left-1/2 z-50 flex gap-2 flex-col -translate-x-1/2 -translate-y-1/2 m-0 p-6 bg-surface-container-high rounded-[28px] shadow-xl border-none"
  >
    {@render children?.()}
  </dialog>
{/if}
