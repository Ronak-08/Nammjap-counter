<script>
let { 
  value = 0,      
  size = 150,      
  max = 0,
  stroke = 5,     
  className = "",
  children        
} = $props();

const radius = 50 - (stroke / 2); 
const circumference = 2 * Math.PI * radius;
let progressRatio = $derived(
  max > 0 ? Math.min(Math.max(value / max, 0), 1) : 0
);

let dashOffset = $derived(circumference * (1 - progressRatio));

let ringColor = $derived.by(() => {
  if(value < max) {return "text-primary";}
  const diff = value - max;
  const stage = Math.floor(diff / 1000)
  if (stage < 1) return "text-yellow-400"; 
  if (stage < 3) return "text-yellow-600";
  if (stage < 5) return "text-green-400";
  if (stage < 7) return "text-purple-500";
  if (stage < 9) return "text-purple-700";

  return "text-black font-bold";
})
</script>

<div 
  class="relative inline-flex items-center justify-center font-medium text-on-surface {className}"
  style="width: {size}px; height: {size}px;"
  role="progressbar"
  aria-valuenow={Math.round(value)}
  aria-valuemax={max}
>
  <svg 
    class="-rotate-90 w-full h-full transform transition-all" 
    viewBox="0 0 100 100"
  >
    <circle
      class="text-surface-container-highest/50" 
      stroke="currentColor"
      stroke-width={stroke}
      fill="transparent"
      cx="50"
      cy="50"
      r={radius}
    />

    <circle
      class={`${ringColor} transition-[stroke-dashoffset] duration-400 ease-in-out`}
      stroke="currentColor"
      stroke-width={stroke}
      stroke-linecap="round" 
      fill="transparent"
      cx="50"
      cy="50"
      r={radius}
      stroke-dasharray={circumference}
      stroke-dashoffset={dashOffset}
    />
  </svg>

  {#if children}
    <div class="absolute inset-0 flex items-center justify-center">
      {@render children()}
    </div>
  {/if}
</div>
