<script>
import CircularProgress from "$lib/components/CircularProgress.svelte";
import Divider from "$lib/components/Divider.svelte";
import { data } from "$lib/state.svelte";
import { browser } from "$app/environment";
let reqXp = $derived(10 * data.level ** 2);
const daily = browser && JSON.parse(localStorage.getItem("daily") ?? "{}");
const history = Object.values(daily).sort((a, b) => b.timestamp - a.timestamp);

function getNextCoinReward() {
  const nextLevel = data.level + 1;
  if (nextLevel <= 10) return 2;
    else if (nextLevel <= 25) return 5;
      else if (nextLevel <= 50) return 10;
        else return 20;
}

function compare() {
  if (!history || history.length === 0) return null;

  const yesterdayCount = history[0]?.count;
  if (!yesterdayCount) return null;

  const difference = data.dailyCount - yesterdayCount;
  const percentChange = ((difference / yesterdayCount) * 100).toFixed(1);

  return {
    difference: difference,
    percent: percentChange,
    isMore: difference > 0
  };
}

</script>

<div class="p-3 md:p-5">
  <header class="px-5 text-center mb-10 py-2 rounded-full bg-surface-container/60">
    <p class="text-3xl font-normal">Stats</p>
  </header>
  <div class="flex m-2 gap-2 md:max-w-[70%] md:mx-auto items-center">
    <div class="bg-primary flex-1/4 text-on-primary rounded-3xl flex flex-col p-3 size-30 transition hover:opacity-90">
      <p class="text-sm font-bold px-1">Total</p>
      <span class="text-4xl text-center mt-3 font-bold">{data.count}</span>
    </div>
    <div class="bg-primary-container flex-1/2 text-on-primary-container rounded-3xl flex flex-col p-3 size-30">
      <div class="flex items-center px-1 justify-between">
        <p class="text-sm font-bold">Today</p>
        {#if compare()}
          {@const comp = compare()}
          <p class="text-xs font-semibold {comp.isMore ? 'text-green-300' : 'text-error'}">
            {comp.isMore ? '↑' : '↓'} {comp.isMore ? '+' : ''}{comp.percent}%
          </p>
        {/if}
      </div>
      <div class="flex mt-3 justify-center">
        <span class="text-3xl font-medium">{data.dailyCount}/</span><span class="font-light opacity-80 text-3xl">{data.dailyGoal}</span>
      </div>
      {#if data.streak > 0}
         <p class="text-sm text-center font-normal mt-2">{data.streak} streak!</p>
      {/if}
    </div>
  </div>

  <Divider />

  <p class="m-2 mb-5 font-normal text-xl text-on-surface-variant">Level</p>
  <div class="flex gap-10 md:p-6 md:max-w-[70%] md:mx-auto transition hover:rounded-2xl m-2 items-center p-4 bg-surface-container-high rounded-3xl shadow-sm">
    <CircularProgress 
      size="85" 
      className="text-2xl font-semibold text-on-surface" 
      stroke="8" 
      value={data.exp} 
      max={reqXp}
    >
      <span>{data.level}</span>
    </CircularProgress>

    <div class="flex gap-1 flex-col max-w-full">
      <p class="text-sm text-on-surface-variant">{data.exp} / {reqXp} XP</p>
      <p class="text-sm text-primary font-medium">Next: +{getNextCoinReward()} coins</p>
    </div>
  </div>

  <Divider />

  {#if history && Object.keys(history).length > 0}
    <p class="m-2 mb-5 font-normal text-xl text-on-surface-variant">Daily</p>
    <div class="grid grid-cols-2 p-2 max-h-60 overflow-y-auto sm:grid-cols-3 gap-2">
      {#each Object.values(history) as item}
        <div class="p-3 px-4 rounded-3xl transition hover:rounded-2xl bg-surface-container-high border border-outline/10">
          <div class="text-2xl font-bold">{item.count}</div>
          <div class="text-xs opacity-60 mt-1">{item.date.slice(0, 10)}</div>
        </div>
      {/each}
    </div>
  {:else}
    <p class="text-sm text-center p-2 text-on-surface-variant/80">No data yet</p>
  {/if}

</div>
