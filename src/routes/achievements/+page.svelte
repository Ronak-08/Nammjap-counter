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
  localStorage.removeItem("shop");
  localStorage.removeItem("modalShown");
  localStorage.removeItem("daily");
  localStorage.removeItem("day");
}

function getLastWeekTotals() {
  if(!browser) return [];
  const data  = JSON.parse(localStorage.getItem("daily") ?? "{}")
  const dates = Object.keys(data).sort()

  const last7 = dates.slice(-7)
  return last7.map(d => ({ date: d, count: data[d] })).reverse()
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

  <div class="grid grid-cols-2 gap-4 m-6 mt-8">
    <div class="flex flex-col items-center justify-center bg-primary text-primary-content p-5 rounded-2xl shadow-lg">
      <span class="text-4xl font-bold">{data.count}</span>
      <span class="text-sm uppercase tracking-wide opacity-80 mt-1">Lifetime</span>
    </div>
    <div class="flex flex-col items-center justify-center bg-secondary text-secondary-content p-5 rounded-2xl shadow-lg">
      <div class="flex items-baseline gap-1">
        <span class="text-4xl font-bold">{data.dailyCount}</span>
        <span class="text-xl opacity-70">/{data.dailyGoal}</span>
      </div>
      <span class="text-sm uppercase tracking-wide opacity-80 mt-1">Today</span>
    </div>
  </div>

  <div class="divider"></div>
  <div class="w-full p-4">
    <h2 class="text-lg font-bold mb-4 px-2 opacity-90">History</h2>

    {#if getLastWeekTotals().length > 0}
      <div class="flex flex-col bg-base-200/50 rounded-2xl overflow-hidden">
        {#each getLastWeekTotals() as day, i}
          <div class="flex justify-between items-center p-3 px-4 hover:bg-base-200 transition-colors 
            {i !== getLastWeekTotals().length - 1 ? 'border-b border-base-300' : ''}">
            <div class="flex flex-col">
              <span class="text-sm font-semibold opacity-80">{day.date}</span>
            </div>
            <div class="badge badge-lg font-bold {day.count > 0 ? 'badge-primary' : 'badge-ghost'}">
              {day.count}
            </div>
          </div>
        {/each}
      </div>
    {:else}
      <p class="text-center opacity-60 text-sm mt-10">No history found.</p>
    {/if}
  </div>

  <div class="flex justify-center items-center">
    <progress class="progress progress-primary m-6 w-[80vw]" value={data.count} max={1000000}></progress>
  </div>

  <Modal {show}/>
  <button onclick={() => show = !show} class="absolute right-4 bottom-[90px] btn btn-primary h-[50px] w-[50px]">
    <span class="material-symbols-outlined">
      trophy
    </span>
  </button>

</main>
