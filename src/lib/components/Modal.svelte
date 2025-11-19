<script>
import { achievements, updateAchievements } from "$lib/achievements.svelte.js";
import { onMount } from "svelte";
import { browser } from "$app/environment";
import { data, saveData } from "$lib/state.svelte";
import { fade } from "svelte/transition";

let {show = false} = $props();

onMount(() => {
  updateAchievements(data.count);
})

function handleClick(color) {
  if(!browser) return;
  data.setColor = color;
  saveData();
}

</script>

{#if show}
<main transition:fade={{duration: 200}} class="fixed top-0 bg-base-100 h-dvh w-full z-10 flex flex-col">

  <div class="navbar bg-base-100 shadow-sm flex-none">
    <div class="flex-1">
      <p class="btn btn-ghost text-xl">Achievements</p>
    </div>
    <div class="flex-none">
      <button onclick={() => show = !show} class="btn btn-square btn-ghost">
        <span class="material-symbols-outlined">close</span>
      </button>
    </div>
  </div>

  {#if achievements.filter(a => a.completed).length === 0}
    <div class="flex-1 flex items-center justify-center"> 
      <p class="text-center w-[200px] opacity-80">No achievement unlocked</p>
    </div>
  {:else}
    <div class="m-4 p-4 flex-1 overflow-y-auto">
      {#each achievements as a (a.id)}
        {#if a.completed}
          <div class="card m-2 w-auto bg-base-200 card-md shadow-sm">
            <div class="card-body flex flex-row">
              <p>{a.text}</p>
              <input
                type="checkbox"
                class={`checkbox ${a.colorUnlocked}`}
                onclick={() => handleClick(a.colorUnlocked)}
              />
            </div>
          </div>
        {/if}
      {/each}
    </div>
  {/if}
</main>
{/if}

