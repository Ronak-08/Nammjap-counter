<script>
import '../app.css';
import { onMount } from 'svelte';
import { restore } from '$lib/state.svelte';
import Tabbar from '$lib/components/Tabbar.svelte';

let { children } = $props();
onMount(() => {
  restore();
});

</script>

<div class="h-dvh flex flex-col">
  <main class="flex-1 bg-bg text-on-bg overflow-y-auto">
    {@render children()}
  </main>
  <Tabbar />
</div>
