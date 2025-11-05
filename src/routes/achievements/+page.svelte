<script>
import { onMount } from "svelte";
import { achievements, updateAchievements } from "$lib/achievements.svelte.js";
import { browser } from "$app/environment";
import { data, saveData,sync,pullFromServer } from "$lib/state.svelte";

onMount(() => {
  updateAchievements(data.count);
})
let modal;
let syncModal;
let password = $state(null);
let syncing = $state(false);

function handleClick(color) {
  if(!browser) return;
  data.setColor = color;
  saveData();
}

function clearData() {
  if(!browser) return;
  data.count = 0;
  data.dailyCount = 0;
  data.dailyGoal = 1000;
  localStorage.removeItem("data");
  localStorage.removeItem("modalShown");
  localStorage.removeItem("daily");
  localStorage.removeItem("day");
}

function getLastWeekTotals() {
  if(!browser) return [];
  const data  = JSON.parse(localStorage.getItem("daily") ?? "{}")
  const dates = Object.keys(data).sort()

  const last7 = dates.slice(-7)
  return last7.map(d => ({ date: d, count: data[d] }))
}

async function syncFunc() {
  syncing = true;
  await sync(password);
  syncing = false;
}

</script>

<dialog bind:this={modal} class="modal">
  <div class="modal-box">
    <h3 class="text-lg font-bold">Delete?</h3>
    <p class="py-4">This will delete all data forever.</p>
    <div class="modal-action">
      <form method="dialog">
        <button class="btn">Close</button>
        <button onclick={clearData} class="btn btn-primary">Yes</button>
      </form>
    </div>
  </div>
</dialog>

<dialog bind:this={syncModal} class="modal">
  <div class="modal-box">
    <h3 class="text-2xl font-bold">Enter Password</h3>
    <p class="py-4">Please enter the password to sync data.</p>
    <input bind:value={password} placeholder="password" class="input my-4 rounded-3xl input-accent" type="text">
    <div class="modal-action">
      <button disabled={syncing} type="button" class="btn btn-primary rounded-3xl" onclick={syncFunc} >
        <span class="material-symbols-outlined">
          sync
        </span>
        {syncing ? 'Syncing' : 'sync'}</button>
      <button onclick={() => pullFromServer(password)} class="btn rounded-3xl btn-outline">
        <span class="material-symbols-outlined">
          sync_arrow_down
        </span>
        Pull
      </button>
    </div>
  </div>
  <form  method="dialog" class="modal-backdrop">
    <button>close</button>
  </form>
</dialog>

<main class="h-dvh overflow-y-auto w-full">
  <div class="navbar bg-base-100 shadow-sm">
    <div class="flex-1">
      <p class="btn btn-ghost text-xl">Stats</p>
    </div>
    <div class="flex gap-2">
  <button onclick={() => syncModal.showModal()} class="btn btn-accent ">
    <span class="material-symbols-outlined">
      sync
    </span>
  </button>
      <button onclick={() => modal.showModal() } class="btn btn-square btn-error">
        <span class="material-symbols-outlined">
          delete_forever
        </span>
      </button>
    </div>
  </div>

  <p class="flex justify-between bg-primary text-primary-content p-2 px-3 rounded-lg m-10 mb-2">Total (in Lifetime) <span  class="font-bold">{data.count}</span></p>
  <p class="flex justify-between bg-secondary text-secondary-content opacity-90 p-2 px-3 rounded-lg m-10 my-2">Today <span  class="font-bold">{data.dailyCount}/{data.dailyGoal}</span></p>
 <div class="divider"></div>
<div class="wrap p-4">
  <h2 class="text-lg font-bold m-3 mb-8">Last 7 days</h2>

  {#if getLastWeekTotals().length > 0}
    {#each getLastWeekTotals() as day}
      <div class="flex bg-base-200 p-2 px-4 rounded-2xl justify-between m-4">
        <span>{day.date}</span>
        <span>{day.count}</span>
      </div>
    {/each}
  {:else}
    <p class="text-center opacity-60 text-sm">no data yet</p>
  {/if}
</div>

<div class="flex justify-center items-center">
  <progress class="progress progress-primary m-6 w-[80vw]" value={data.count} max={1000000}></progress>
</div>
 <div class="divider"></div>
  <div class="wrap flex flex-col h-fit mb-6 gap-2 p-6">
    <h2 class="text-lg font-bold m-3">Achievements</h2>
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
  </div>
</main>
