<script>
import { browser } from '$app/environment';
import { onMount } from 'svelte';
import { fade, fly } from 'svelte/transition';
import { data, restore, saveData } from '$lib/state.svelte.js';

const getToday = () => new Date().toDateString();

let percent = $derived(() =>
  data.dailyCount > 0 ? Math.min(100, Math.floor((data.dailyCount / data.dailyGoal) * 100)) : 0
);

let showToast = $state(false);
let timer;
let modal = $state(null);
let shown = $state(false);

function save(evt) {
  if (!browser) return;
  checkAndResetDay(); 
  data.count++;
  data.dailyCount++;
  if (data.count % 1000 === 0) {
    data.coins++;
  }
  clearTimeout(timer);
  timer = setTimeout(() => {
    saveData();
    checkGoalToast();
  }, 1000);
}

function checkGoalToast() {
  const today = getToday();
  const lastShown = localStorage.getItem("goalShown");
  if (data.dailyCount >= data.dailyGoal && lastShown !== today) {
    showToast = true;
    setTimeout(() => {
      showToast = false;
    }, 3000);
    localStorage.setItem("goalShown", today);
  }
}

$effect(() => {
  if (data.count > 0 && data.count % 1000 === 0 && typeof sync !== 'undefined') {
    sync();
  }
});

function colorClass() {
  if (data.dailyCount < data.dailyGoal) return "text-base-content";

  const diff = data.dailyCount - data.dailyGoal;
  const stage = Math.floor(diff / 1000);

  if (stage < 1) return "text-yellow-300";
  if (stage < 3) return "text-yellow-500";
  if (stage < 5) return "text-green-300";
  if (stage < 7) return "text-purple-500";
  if (stage < 9) return "text-purple-700";

  return "text-black font-bold";
}

function textColor() {
  if (!browser) return "text-base-content";
  return data.setColor || "text-base-content";
}

function tag() {
  const n = data.count;
  if (n >= 100_000) return "Master";
  if (n >= 50_000) return "Pro Mode";
  if (n >= 25_000) return "Rising";
  if (n >= 10_000) return "Serious";
  if (n >= 5_000) return "Keep Going!";
  if (n >= 2_000) return "Grinding";
  if (n >= 1_000) return "Starter";
  return "New";
}

function finalizeYesterday(day, count) {
  if (!day) return;
  try {
    const d = JSON.parse(localStorage.getItem("daily") ?? "{}");
    d[day] = count;
    localStorage.setItem("daily", JSON.stringify(d));
  } catch (e) {
    console.error("Failed to save history", e);
  }
}

function checkAndResetDay() {
  if (!browser) return;

  const today = getToday();
  const savedDay = localStorage.getItem("day");

  if (!savedDay) {
    localStorage.setItem("day", today);
    return;
  }

  if (savedDay !== today) {
    console.log(`New day detected: ${today}. Resetting count.`);

    finalizeYesterday(savedDay, data.dailyCount);

    data.dailyCount = 0;

    localStorage.setItem("day", today);

    saveData(); 
  }
}

onMount(() => {
  restore(); 
  checkAndResetDay(); 

  const alreadyShown = localStorage.getItem('modalShown');
  if (!alreadyShown) {
    setTimeout(() => modal?.showModal(), 0); 
    localStorage.setItem('modalShown', 'true');
  }

  const handleVisibility = () => {
    if (document.visibilityState === 'visible') {
      checkAndResetDay();
    }
  };

  document.addEventListener("visibilitychange", handleVisibility);

  return () => {
    document.removeEventListener("visibilitychange", handleVisibility);
  };
});

$effect(() => {
  const n = Number(data.dailyGoal);
  if (!isNaN(n)) data.dailyGoal = n;
});

</script>


{#if !shown}
  <dialog bind:this={modal} class="modal">
    <div class="modal-box">
      <h3 class="text-lg font-bold">Hello!</h3>
      <p class="py-4">Enter your daily goal.</p>
      <input min="100" type="number" bind:value={data.dailyGoal} placeholder="100,200.." class="input" />
    </div>
    <form method="dialog" class="modal-backdrop">
      <button>close</button>
    </form>
  </dialog>
{/if}

<main class="flex flex-col items-center h-full justify-between overflow-hidden">
  <div tabindex="0" role="button" onclick="{() => {save(event)}}" class="h-dvh absolute bg-transparent inset-0 z-0"></div>

  <div class="flex w-full items-center justify-between mx-4 p-2">
    <div class="badge">
      {tag()}
    </div>
    <div class="p-2 font-bold text-primary">{data.coins}</div>
  </div>

  <h1 class={`text-[10rem] md:text-[13rem] z-0 ${textColor()}`} >राधा</h1>

  <div class={`radial-progress ${colorClass()}`} style="--value:{percent()}; --size:12rem; --thickness: 9px;" aria-valuenow={percent()} role="progressbar">
    <p class="font-bold text-3xl p-2">{data.dailyCount}</p>
  </div>

  {#if showToast}
    <div class="toast toast-top toast-center">
      <div class="alert alert-info">
        <span>
          Goal reached! 🔥
        </span>
      </div>
    </div>
  {/if}

</main>


<style>
main {
  user-select: none;
  -moz-user-select: none;
}
</style>
