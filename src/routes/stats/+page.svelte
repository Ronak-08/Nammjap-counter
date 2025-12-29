<script>
import CircularProgress from "$lib/components/CircularProgress.svelte";
import Divider from "$lib/components/Divider.svelte";
import { data } from "$lib/state.svelte";
import { browser } from "$app/environment";
	import Ripple from "$lib/components/Ripple.svelte";
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

<div class="mx-auto max-w-6xl p-4 md:p-6">
  <header class="mb-8 rounded-full bg-surface-container/60 py-2 text-center md:mx-auto md:mb-12 md:w-fit md:px-16">
    <p class="text-3xl font-black text-on-surface">Stats</p>
  </header>

  <div class="mb-8 grid grid-cols-2 p-1 gap-3 md:grid-cols-3 md:gap-4">

    <div class="rounded-[28px] bg-primary p-4 text-on-primary transition hover:opacity-90 md:aspect-auto md:h-full md:p-6">
      <p class="text-sm font-semibold mb-6 md:text-base">Total</p>
      <span class="text-5xl mx-1 font-bold py-2">{data.count}</span>
      <div class="hidden md:block"></div>
    </div>

    <div class="flex-col rounded-[28px] bg-primary-container p-4 text-on-primary-container md:aspect-auto md:h-full md:p-6">
      <div class="flex items-center mb-6 justify-between">
        <p class="text-sm font-bold md:text-base">Today</p>
        {#if compare()}
          {@const comp = compare()}
          <p class="text-xs font-semibold md:text-sm {comp.isMore ? 'text-green-500' : 'text-error'}">
            {comp.isMore ? '↑' : '↓'} {comp.isMore ? '+' : ''}{comp.percent}%
          </p>
        {/if}
      </div>
      <div class="flex items-baseline justify-center gap-0.5">
        <span class="text-4xl font-medium md:text-5xl">{data.dailyCount}</span>
        <span class="text-2xl font-light opacity-80 md:text-3xl">/{data.dailyGoal}</span>
      </div>
      {#if data.streak > 0}
        <p class="mt-1 text-center text-xs font-normal opacity-80">{data.streak} streak!</p>
      {/if}
    </div>

    <div class="col-span-2 flex items-center gap-6 rounded-[28px] bg-surface-container-high p-4 shadow-sm transition hover:bg-surface-container-highest md:col-span-1 md:flex-col md:items-start md:justify-between md:p-5">
            <Ripple />
      <CircularProgress size="65" stroke="8" value={data.exp} max={reqXp} className="text-xl font-semibold">
        {data.level}
      </CircularProgress>
      <div class="flex flex-col gap-1 md:px-3">
        <p class="text-sm text-on-surface-variant md:text-base">{data.exp} / {reqXp} XP</p>
        <p class="text-[0.8rem] text-primary">Next: +{getNextCoinReward()} coins</p>
      </div>
    </div>
  </div>

  <div>
    <p class="mb-5 ml-2 text-lg font-normal text-on-surface-variant">History</p>
    {#if history && Object.keys(history).length > 0}
      <div class="grid p-3 max-h-96 grid-cols-2 gap-3 overflow-y-auto bg-surface-container rounded-3xl sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
        {#each Object.values(history) as item}
          <div class="flex flex-col justify-center rounded-2xl hover:rounded-lg border shadow border-outline/10 bg-surface-container-high p-4 transition hover:bg-surface-container-highest">
            <Ripple />
            <div class="text-2xl font-bold opacity-90 md:text-3xl">{item.count}</div>
            <div class="mt-1 text-xs opacity-60 md:text-sm">{item.date.slice(0, 10)}</div>
          </div>
        {/each}
      </div>
    {:else}
      <div class="p-8 text-center">
        <p class="text-sm text-on-surface-variant/80">No data available yet</p>
      </div>
    {/if}
  </div>
</div>
