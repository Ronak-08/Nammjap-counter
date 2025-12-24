<script>
import { page } from "$app/stores";
import Home from "~icons/material-symbols/home-outline";
import HomeFilled from "~icons/material-symbols/home";
import BarChart from "~icons/material-symbols/bar-chart";
import ShoppingBag from "~icons/material-symbols/shopping-bag-outline";
import ShoppingBagFilled from "~icons/material-symbols/shopping-bag";


let path = $derived($page.url.pathname);

const links = [
  { label: 'Home', href: '/', icon: Home, activeIcon: HomeFilled },
  { label: 'Stats', href: '/stats', icon: BarChart, activeIcon: BarChart},
  { label: 'Shop', href: '/shop', icon: ShoppingBag, activeIcon: ShoppingBagFilled},
];

function isActive(href) {
  if (href === '/') return path === '/';
  return path.startsWith(href);
}
</script>

<nav class="
  flex flex-row z-50 bg-surface-container-low border-outline-variant/30 
  w-full h-[66px] border-t
  md:w-24 lg:w-28 md:h-full md:flex-col md:justify-between md:items-center md:py-3 md:border-r md:border-t-0
  ">  
  <div class="
    flex items-center justify-around w-full h-full
    md:flex-col md:justify-start md:gap-3 md:pt-6
    ">
    {#each links as link}
      {@const active = isActive(link.href)}
      {@const IconComponent = active ? link.activeIcon : link.icon}

      <a 
        href={link.href} 
        class="
        flex flex-col items-center justify-center gap-1 
        w-13 h-full md:w-full md:h-auto md:py-2
        transition-opacity hover:opacity-100 outline-none
        "
      >
        <div class="
          flex items-center justify-center rounded-full transition-colors duration-200
          w-15 h-8 md:w-14 md:h-8
          {active 
            ? 'bg-primary-container/80 text-on-primary-container' 
            : 'text-on-surface-variant hover:bg-on-surface/10'}
          ">
          <IconComponent class="text-xl" />
        </div>

        <span class="
          text-[11px] font-medium truncate max-w-full px-1
          transition-colors duration-200
          {active ? 'text-on-surface font-semibold' : 'text-on-surface-variant'}
          ">
          {link.label}
        </span>
      </a>
    {/each}
  </div>
</nav>
