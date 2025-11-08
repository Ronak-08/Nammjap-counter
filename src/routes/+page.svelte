<script>
import { browser } from '$app/environment';
import { onMount } from 'svelte';
import { fade, fly } from 'svelte/transition';
import { achievements } from '$lib/achievements.svelte.js';
import { data,restore,saveData } from '$lib/state.svelte.js';

let percent = $derived(() => 
  data.dailyCount > 0 ? Math.min(100, Math.floor((data.dailyCount/data.dailyGoal)*100)) : 0
);
let showToast = $state(false);
let timer;
let floats = $state([]);
let today = new Date().toDateString();
let modal = $state(null);
let shown = $state(false);

function save(evt) {
  if (!browser) return;
  data.count++;
  data.dailyCount++;
  floats.push({id: Date.now(), text: "राधा", x: evt.clientX, y: evt.clientY})
  setTimeout(() => {
    floats =  floats.filter(f => f.id !== floats.id);
  }, 400);
  clearTimeout(timer);
  timer = setTimeout(() => {
    saveData();
    const lastShown = localStorage.getItem("goalShown");
    if(data.dailyCount >= data.dailyGoal && lastShown !== today) {
      showToast = true;
      setTimeout(() => {
        showToast = false; 
      }, 2000);
      localStorage.setItem("goalShown", today);
    }
  },300);
}

$effect(() => {
 if(data.count > 0 && data.count % 1000 === 0) {
    sync();
  }
})

function colorClass() {
  if (data.dailyCount < data.dailyGoal) return "text-secondary-content";

  const diff = data.dailyCount - data.dailyGoal;
  const stage = Math.floor(diff / 1000);

  if (stage < 1) return "text-primary";
  if (stage < 3) return "text-secondary";
  if (stage < 5) return "text-accent";
  if (stage < 7) return "text-purple-500";
  if (stage < 9) return "text-purple-700";

  return "text-black font-bold";
}

function textColor() {
  if(!browser) return;
  return data.setColor || "text-base-content";
}
function tag() {
  const n = data.count;

  if (n >= 100_000) return "Master";
  if (n >= 50_000)  return "Pro Mode";
  if (n >= 25_000)  return "Rising";
  if (n >= 10_000)  return "Serious";
  if (n >= 5_000)   return "Keep Going!";
  if (n >= 2_000)   return "Grinding";
  if (n >= 1_000)   return "Starter";
  return "New";
}

function finalizeYesterday(day,count) {
  const d = JSON.parse(localStorage.getItem("daily") ?? "{}");
  const hasAnyHistory = Object.keys(d).length > 0;

  if(!hasAnyHistory) return;
  d[day] = count;
  localStorage.setItem("daily", JSON.stringify(d));
}

onMount(() => {
  restore();
  const alreadyShown = localStorage.getItem('modalShown');
  if (!alreadyShown) {
    setTimeout(() => modal?.showModal(), 0);
    localStorage.setItem('modalShown', 'true');
  }
  let savedDay = localStorage.getItem("day");
  if(savedDay !== today) {
    finalizeYesterday(savedDay,data.dailyCount);
    data.dailyCount = 0;
    localStorage.setItem("day",today);
  }
});

$effect(() => {
  if(data.dailyGoal) saveData();
})
</script>

{#if !shown}
  <dialog bind:this={modal} class="modal">
    <div class="modal-box">
      <h3 class="text-lg font-bold">Hello!</h3>
      <p class="py-4">Enter your daily goal.</p>
      <input type="number" bind:value={data.dailyGoal} placeholder="100,200.." class="input" />
    </div>
    <form method="dialog" class="modal-backdrop">
      <button>close</button>
    </form>
  </dialog>
{/if}

<main class="flex flex-col items-center h-full justify-between overflow-hidden">
  <div tabindex="0" role="button" onclick="{() => {save(event)}}" class="h-dvh absolute bg-transparent inset-0 z-0"></div>
  
  <div class="badge  fixed left-2 top-[15px]">
    {tag()}
  </div>

  <h1 class={`text-[10rem] md:text-[13rem] z-0 ${textColor()} my-6`} >राधा</h1>

  <div class="radial-progress" style="--value:{percent()}; --size:12rem; --thickness: 9px;" aria-valuenow={percent()} role="progressbar">
    <p class={`p-1 px-3 bg-secondary rounded-2xl font-bold text-xl ${colorClass()}`}>{data.dailyCount}</p>
  </div>

  {#if showToast}
    <div class="toast toast-top toast-center">
      <div class="alert alert-info">
        <span>
          Goal reached! 🔥  
          But this is not the finish — keep going, keep rising ✨
        </span>
      </div>
    </div>
  {/if}

  {#each floats as f (f.id)}
    <p class="absolute float text-xl pointer-events-none" style="left:{f.x}px; top:{f.y}px;">{f.text}</p>
  {/each}
</main>

<style>
.float {
  animation: float 600ms ease-out forwards;
}
@keyframes float {
  0%   { transform: translateY(0);   opacity:1; }
  100% { transform: translateY(-50px); opacity:0; }
}
</style>
