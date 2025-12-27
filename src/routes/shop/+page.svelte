<script>
import { tick } from "svelte";
import { fade } from "svelte/transition";
import Toast from "$lib/components/Toast.svelte";
import { data, saveData } from "$lib/state.svelte";

const colors = [
  { name: 'Default', class: 'text-on-surface', cost: 0 },
  { name: 'Primary', class: 'text-primary', cost: 50 },
  { name: 'Secondary', class: 'text-secondary', cost: 50 },
  { name: 'Blue', class: 'text-blue-400', cost: 75 },
  { name: 'Green', class: 'text-green-400', cost: 100 },
  { name: 'Red', class: 'text-red-400', cost: 200 },
  { name: 'Error', class: 'text-error', cost: 300 },
  { name: 'Purple', class: 'text-purple-400', cost: 550 },
  { name: 'Pink', class: 'text-pink-400', cost: 650 },
  { name: 'Orange', class: 'text-orange-400', cost: 750 },
  { name: 'Gold', class: 'text-yellow-500', cost: 900 }
];

let toast = $state({ show: false, msg: '' });

async function notify(msg) {
  if (toast.show) {
    toast.show = false;
    await tick();
  }
  toast = { show: true, msg };
}

function handleColor(item) {
  if (data.unlockedColors.includes(item.class)) {
    data.setColor = item.class;
    saveData();
    notify(`Applied ${item.name}`);
    return;
  }
  if (data.coins < item.cost) return notify("Insufficient funds");

  data.coins -= item.cost;
  data.unlockedColors.push(item.class);
  data.setColor = item.class;
  saveData();
  notify(`Unlocked ${item.name}`);
}
</script>

<Toast time="2000" show={toast.show} content={toast.msg} />

<div class="min-h-full bg-surface p-4 md:p-6">
  <header class="sticky top-2 z-10 mb-6 flex items-center justify-between rounded-full bg-surface-container/80 px-6 py-3 backdrop-blur-md shadow-sm">
    <h1 class="text-2xl font-normal text-on-surface">Store</h1>
    <div class="flex items-center gap-2 rounded-full bg-secondary-container px-3 py-1.5 text-on-secondary-container">
      <span class="text-sm font-bold">{data.coins}</span>
    </div>
  </header>

  <section class="p-2">
    <h2 class="mb-6 px-2 text-sm font-medium text-on-surface-variant opacity-80">Styles</h2>
    <div class="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
      {#each colors as c}
        {@const unlocked = data.unlockedColors.includes(c.class)}
        {@const active = data.setColor === c.class}

        <button
          onclick={() => handleColor(c)}
          disabled={!unlocked && data.coins < c.cost}
          class="group relative flex flex-col gap-3 overflow-hidden rounded-[20px] bg-surface-container-low p-4 text-left transition-all duration-300 hover:rounded-[28px] hover:bg-surface-container-high active:scale-95 disabled:opacity-50 {active ? 'ring-2 ring-primary ring-offset-surface' : ''}"
        >
          <div class="rounded-2xl py-2 text-4xl font-bold transition-transform group-hover:scale-110 {c.class}">
            Aa
          </div>

          <div class="flex w-full items-end justify-between">
            <div>
              <p class="text-sm font-medium text-on-surface">{c.name}</p>
              <p class="text-xs text-on-surface-variant/80">{unlocked ? 'Owned' : `${c.cost}`}</p>
            </div>
            {#if active}
              <div class="size-2 rounded-full bg-primary" in:fade></div>
            {/if}
          </div>

          {#if !unlocked}
            <div class="absolute inset-0 bg-surface-scrim/5 opacity-0 transition-opacity group-hover:opacity-100"></div>
          {/if}
        </button>
      {/each}
    </div>
  </section>
</div>
