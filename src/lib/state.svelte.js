export let data = $state({
  count: 0,
  nam: "",
  dailyCount: 0,
  dailyGoal: 1000,
  setColor: null,
  coins: 0,
})

export let shop = $state([
  {name:"Gold", purchased: false, color:"text-yellow-500", selected: false, price: 100}, 
  {name:"Cyan", purchased: false,color: "text-cyan-500", selected: false, price: 200}, 
  {name:"Blue", purchased: false, color: "text-blue-300", selected: false, price: 300}, 
  {name:"Green", purchased: false, color:"text-green-500", selected: false, price: 500}, 
])

export function loadShop() {
  const raw = localStorage.getItem("shop");
  if(!raw) return
  Object.assign(shop, JSON.parse(raw))
}

function save() {
  localStorage.setItem("shop", JSON.stringify(shop))
}

export function restore() {
  const raw = localStorage.getItem("data")
  if(!raw) return
  Object.assign(data, JSON.parse(raw))
}
export function saveData() {
  localStorage.setItem("data", JSON.stringify(data))
}
