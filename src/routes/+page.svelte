<script>
import { browser } from '$app/environment';
import { onMount } from 'svelte';
import { fade, fly } from 'svelte/transition';
import { data, restore, saveData } from '$lib/state.svelte.js';
import Modal from '$lib/components/Modal.svelte';
import Button from '$lib/components/Button.svelte';
import CircularProgress from '$lib/components/CircularProgress.svelte';
	import Toast from '$lib/components/Toast.svelte';

const getToday = () => new Date().toDateString();
let showToast = $state(false);
let timer = $state();
let show = $state(false);
let content = $state("");
let reqXp = $derived(10 * data.level ** 2);

function save() {
  if (!browser) return;
  checkAndResetDay(); 
  data.count++;
  data.dailyCount++;
  data.exp++;
  levelUp();
  if (data.count % 1000 === 0) {
    data.coins++;
  }
  clearTimeout(timer);
  timer = setTimeout(() => {
    saveData();
    if(!showToast){
    checkGoalToast();
    }
  }, 1000);
}

function levelUp() {
  let oldLevel = data.level;
  while (reqXp > 0 && data.exp >= reqXp) {
    data.exp -= reqXp;
    data.level++;
  }

  if(data.level > oldLevel) {
    content = `Level Up! You are now level ${data.level} ⚡`;
    showToast = true;
  }
}

function checkGoalToast() {
  const today = getToday();
  const lastShown = localStorage.getItem("goalShown");
  if (data.dailyCount >= data.dailyGoal && lastShown !== today) {
    content = "Goal Completed! 🎉";
    showToast = true;

    localStorage.setItem("goalShown", today);
  }
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
    show = true;
    localStorage.setItem('modalShown', true);
  }
  checkAndResetDay();
});


</script>


<Modal {show}>
  <p class="text-3xl">Hello!</p>
  <div class="flex mt-2 flex-col gap-3">
    <p class="mx-1 text-on-surface-variant">Enter your daily goal</p>
    <input class="rounded-2xl font-medium border-2 border-outline-variant/70 focus:border-primary bg-surface-container p-2 py-3 focus:rounded-xl transition w-full " type="text" bind:value={data.dailyGoal} placeholder="Goal">
  </div>
  <div class="flex justify-end gap-2 mt-2 w-full">
    <Button class="px-3 active:rounded-2xl" onclick={() => show = !show} variant="outline">Cancel</Button>
    <Button onclick={() => {saveData; show = !show}} class="px-5">Set</Button>
  </div>
</Modal>

<Toast time="2000" show={showToast} content={content} />

<div role="button" tabindex="-1" onkeyup={() => {}}  onclick={save} class="fixed bg-transparent z-0 inset-0 h-full w-full"></div>

<div class="flex h-full p-2 flex-col">
  <header class="flex justify-between items-center bg-surface-container/60 rounded-full p-3">
    <CircularProgress size="35" className="text-sm font-medium text-on-surface" stroke="6" value={data.exp} max={reqXp} ><span>{data.level}</span></CircularProgress>
    <p class="p-1 shadow-md transition-all hover:rounded-2xl px-3 text-sm rounded-full text-on-surface bg-surface-container-high">{tag()}</p>
    <p class="px-3 p-1 text-secondary font-light ">{data.coins}</p>
  </header>

  <div class="flex flex-1 justify-evenly items-center flex-col">
    <input type="text" onchange={saveData} placeholder="name" bind:value={data.nam} class="{textColor} text-center m-2 text-[4rem] text-on-surface font-bold z-2 max-w-[60vw]">
    <CircularProgress className="text-3xl" max={data.dailyGoal} value={data.dailyCount} >{data.dailyCount}</CircularProgress>
  </div>
</div>
