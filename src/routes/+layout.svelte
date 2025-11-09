<script>
import '../app.css';
import { page } from '$app/state';
import { onMount } from 'svelte';
import { restore } from '$lib/state.svelte';

let { children } = $props();
const isActive = (path) => {
  return page.url.pathname === path ? "dock-active" : "none";
}
onMount(() => {
  restore();
});

</script>

{@render children()}
<div class="dock dock-md">
  <a href="/" class={isActive("/")}>
    <span class="material-symbols-outlined">
      home
    </span>
    <span class="dock-label">Home</span>
  </a>

  <a href="/achievements" class={isActive("/achievements")}>
    <span class="material-symbols-outlined">
      bar_chart
    </span>
    <span class="dock-label">Stats</span>
  </a>
</div>
