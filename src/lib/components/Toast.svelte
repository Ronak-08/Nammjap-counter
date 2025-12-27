<script>
import { fade, fly} from "svelte/transition";

let { 
  show = $bindable(false),
  content = "", 
  className = "", 
  time = 3000 
} = $props();

$effect(() => {
  if (show) {
    const timer = setTimeout(() => {
      show = false;
    }, time);

    return () => clearTimeout(timer);
  }
});
</script>

{#if show}
  <div 
    in:fly={{y: -30, duration: 400, opacity: 0}}
    out:fade={{duration: 200}}
    class="fixed w-[90%] md:w-[50%] text-center font-medium text-base top-8 left-1/2 -translate-x-1/2 z-50 p-4 rounded-2xl bg-surface-container-high shadow-lg {className}"
  >
    <p>{content}</p>
  </div>
{/if}
