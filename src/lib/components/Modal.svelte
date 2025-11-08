<script>
import { achievements, updateAchievements } from "$lib/achievements.svelte.js";
import { onMount } from "svelte";
import { browser } from "$app/environment";
import { data } from "$lib/state.svelte";
import { fade } from "svelte/transition";

let {show = false} = $props();
onMount(() => {
  updateAchievements(data.count);
})
</script>

{#if show}
  <main transition:fade={{duration: 200}} class="fixed top-0 bg-base-100 h-dvh w-full z-10" >

    <div class="navbar bg-base-100 shadow-sm">
      <div class="flex-1">
        <p class="btn btn-ghost text-xl">Achievements</p>
      </div>
      <div class="flex-none">
        <button onclick={() => show = !show} class="btn btn-square btn-ghost">
          <span class="material-symbols-outlined">
            close
          </span>
        </button>
      </div>
    </div>

    {#if achievements.filter(a => a.completed).length === 0}
      <p class="text-center m-3 mt-8 opacity-80">No achievement unlocked</p>
    {:else}
      {#each achievements as a (a.id)}
        {#if a.completed}
          <div class="card w-auto bg-base-100 card-md shadow-sm">
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
    {/if}
  </main>
{/if}

