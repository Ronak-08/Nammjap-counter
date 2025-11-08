<script>
import { onMount } from "svelte";
import { browser } from "$app/environment";
import { data, saveData,sync,pullFromServer } from "$lib/state.svelte";
import Modal from '$lib/components/Modal.svelte';

let modal;
let show = $state(false);
let syncModal;
let syncing = $state(false);
let apiKey = $state("");
let binId = $state("");

onMount(() => {
  apiKey = document.cookie
    .split("; ")
    .find(row => row.startsWith("jsonbin_key="))
    ?.split("=")[1] ?? "";

  binId = document.cookie
    .split("; ")
    .find(row => row.startsWith("jsonbin_bin="))
    ?.split("=")[1] ?? "";
});

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
  await sync();
  syncing = false;
}

function saveCreds() {
  document.cookie = `jsonbin_key=${apiKey}; path=/; max-age=31536000`;
  document.cookie = `jsonbin_bin=${binId}; path=/; max-age=31536000`;
  syncModal.close();
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
    <h3 class="text-lg font-bold">Enter BIN + API</h3>
    <p class="py-4">Go to <a class="text-secondary" href="https://jsonbin.io">jsonbin</a> and copy your api and binId</p>
    <input
      bind:value={apiKey}
      placeholder="API Key"
      class="input my-3 w-full rounded-3xl input-accent"
    />

    <input
      bind:value={binId}
      placeholder="BIN ID"
      class="input my-3 w-full rounded-3xl input-accent"
    />

  <div class="modal-action ml-auto">
    <button
      type="button"
      class="btn btn-primary rounded-3xl"
      onclick={saveCreds}
    >
      Save
    </button>
  </div>
  </div>
  <form method="dialog" class="modal-backdrop">
    <button>close</button>
  </form>
</dialog>

<main class="h-dvh overflow-y-auto w-full">
  <div class="navbar bg-base-100 shadow-sm">
    <div class="flex-1">
      <p class="btn btn-ghost text-xl">Stats</p>
    </div>
    <div class="flex gap-2">
      {#if !apiKey || !binId}
        <button onclick={() => syncModal.showModal()} class="btn btn-accent ">
          <span class="material-symbols-outlined">
            sync
          </span>
        </button>
      {:else} 
        <button onclick={syncFunc} disabled={syncing} class="btn btn-accent ">
          <span class="material-symbols-outlined">
            sync
          </span>
          {syncing ? 'Syncing' : 'Sync'}
        </button>
        <button class="btn btn-neutral" onclick={pullFromServer}>pull</button>

      {/if}
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
  <Modal {show}/>
  <button onclick={() => show = !show} class="absolute right-4 bottom-[90px] btn btn-primary h-[50px] w-[50px]">
    <span class="material-symbols-outlined">
      trophy
    </span>
  </button>

</main>
