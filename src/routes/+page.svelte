<script>
import { browser } from '$app/environment';
import { onDestroy, onMount, tick } from 'svelte';
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

async function triggerToast(msg) {
  if (showToast) {
    showToast = false; 
    await tick();
  }
  content = msg;
  showToast = true;
}

function save() {
  if (!browser) return;
  data.count++;
  data.dailyCount++;
  data.exp++;
  levelUp();
  const milestones = [100, 500, 1000, 5000, 10000, 25000, 50000, 100000];
  if (milestones.includes(data.count)) {
    const bonus = Math.floor(data.count / 100);
    data.coins += bonus;
    triggerToast(`🎯 ${data.count} milestone! +${bonus} coins`);
  }
  clearTimeout(timer);
  timer = setTimeout(() => {
    saveData();
    checkGoalToast();
  }, 500);
}

onDestroy(() => {
  if(browser) saveData();
})

function levelUp() {
  let oldLevel = data.level;
  while (reqXp > 0 && data.exp >= reqXp) {
    data.exp -= reqXp;
    data.level++;
  }

  if(data.level > oldLevel) {
    let coinReward;
    if (data.level <= 10) coinReward = 2;
      else if (data.level <= 25) coinReward = 5;
        else if (data.level <= 50) coinReward = 10;
          else coinReward = 20;
    data.coins += coinReward;

    triggerToast(`Leveled Up to ${data.level} (+${coinReward} coins)`);
  }
}

function checkGoalToast() {
  const today = getToday();
  const lastShown = localStorage.getItem("goalShown");
  if (data.dailyCount >= data.dailyGoal && lastShown !== today) {
    localStorage.setItem("goalShown", today);
    triggerToast("Goal Completed! 🎉");
  }
}

function textColor() {
  if (!browser) return "text-on-surface";
  return data.setColor || "text-on-surface";
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
  try {
    const d = JSON.parse(localStorage.getItem("daily") ?? "{}");
    d[day] = {
      date: day,
      count: count,
      timestamp: new Date(day).getTime()
    };

    localStorage.setItem("daily", JSON.stringify(d));
  } catch (e) {
    console.error("Failed to save history", e);
  }
}

function checkAndResetDay() {
  if(!browser) return;

  let now = new Date();
  let todayStr = now.toDateString();
  let savedDay = localStorage.getItem("day");
  let yesterday = new Date();
  yesterday.setDate(now.getDate() - 1);
  const yesterdayStr = yesterday.toDateString();

  if(savedDay && savedDay !== todayStr) {
    if(savedDay === yesterdayStr) {
      data.streak++;
      if(data.streak > data.longestStreak) data.longestStreak = data.streak;
      triggerToast(`${data.streak} day streak!`);
    } else {
      data.streak = 0;
    }
    finalizeYesterday(savedDay, data.count);
    data.dailyCount = 0;
    localStorage.setItem("day", todayStr);
    saveData();
  } else if(!savedDay) {
    localStorage.setItem("day", todayStr);
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
});



function handleSave() {
  const val = data.dailyGoal;
  if (!val || val < 108 || val > 1_000_000) return;
  saveData();
  show = false;
}
</script>

<Modal {show}>
  <div class="flex flex-col gap-3 p-1">
    <h2 class="text-2xl font-normal mb-3 text-on-surface">Daily Goal</h2>

    <input 
      type="number" 
      bind:value={data.dailyGoal}
      min="108" 
      max="1000000"
      required
      class="peer w-full rounded-xl bg-surface-container-highest px-3 py-2.5 text-lg text-on-surface outline-none ring-2 ring-transparent transition-all focus:ring-primary invalid:ring-error invalid:text-error"
      placeholder="Target Amount"
    >

    <div class="flex w-full mt-4 justify-end gap-2">
      <Button class="px-4" variant="text" onclick={() => show = false}>Cancel</Button>
      <Button class="px-4" onclick={handleSave}>Set</Button>
    </div>
  </div>
</Modal>

<Toast time="2000" show={showToast} content={content} />

<div role="button" tabindex="-1" onkeyup={() => {}}  onclick={save} class="fixed bg-transparent z-0 inset-0 h-full w-full"></div>

<div class="flex h-full p-2 md:p-5 flex-col">
  <header class="flex justify-between lg:w-[80%] lg:mx-auto items-center bg-surface-container/60 rounded-full p-3">
    <CircularProgress size="32" className="text-sm font-medium text-on-surface" stroke="6" value={data.exp} max={reqXp} ><span>{data.level}</span></CircularProgress>
    <p class="p-1 shadow-md transition-all hover:rounded-2xl px-3 text-sm rounded-full text-on-surface bg-surface-container-high">{tag()}</p>
    <p class="px-3 p-1 text-secondary font-light ">{data.coins}</p>
  </header>

  <div class="flex flex-1 items-center mt-8 md:m-auto md:justify-center flex-col">

    <input 
      type="text" 
      bind:value={data.nam}
      onchange={saveData}
      class="text-center m-2 font-semibold z-2 w-full text-9xl md:text-[min(16vw,9rem)]
      {textColor()}"
      style="{textColor()} caret-color: currentColor;"
    >

    <CircularProgress size="160" className="text-3xl {textColor()} mt-14" max={data.dailyGoal} value={data.dailyCount} ><span class="{textColor()}">{data.dailyCount}</span></CircularProgress>
  </div>
</div>
