<script>
	import { browser } from "$app/environment";
import { saveData,shop,data, loadShop } from "$lib/state.svelte.js";
	import { onMount } from "svelte";
	import { fade } from "svelte/transition";

  let show = $state(false);
  let timeout;

function save() {
 if(!browser) return; 
  localStorage.setItem("shop", JSON.stringify(shop));
}
function purchase(color) {
    if(data.coins >= color.price) {
  data.coins -= color.price;
  color.purchased = true;
    save();
    saveData();
    } else {
       show = true;
      clearTimeout(timeout);
     timeout = setTimeout(() => {
     show = false;
      }, 800);
    }
}

function setColor(d) {
  if(!d.purchased) return;
  shop.forEach(c => c.selected = false);
  d.selected = true;
  data.setColor = d.color;
  saveData();
  save();
}

  onMount(() => {  
    loadShop();
})
</script>

  <div class="navbar bg-base-100 shadow-sm">
    <div class="flex-1">
      <p class="btn btn-ghost text-xl">Shop</p>
    </div>
  <div class="p-2 font-bold m-4 text-primary">{data.coins}</div>
  </div>
<main>
  <div class="bg-base-100 p-2 m-2 rounded-box shadow-md">
    {#each shop as color}
    <div class="flex p-2 bg-base-200 items-center rounded-box my-2 justify-between">
        <p class={`mx-2 ${color.color}`}>{color.name}</p>
        <div class="flex items-center gap-2">
        <button disabled={color.purchased} onclick={() => {purchase(color)}} class="btn w-fit">{color.price}</button>
        <input type="radio" checked={color.selected} disabled={!color.purchased} onchange={() => setColor(color)} name="radio-1" class="radio" />
        </div>
      </div>
{/each}
  </div>
</main>

{#if show}
<div role="alert" transition:fade={{duration:300}} class="alert alert-error fixed top-5 mx-4">
  <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 shrink-0 stroke-current" fill="none" viewBox="0 0 24 24">
    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
  <span>Not enough coins.</span>
</div>
{/if}
