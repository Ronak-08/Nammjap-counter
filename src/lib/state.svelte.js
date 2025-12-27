export let data = $state({
  count: 0,
  nam: "",
  dailyCount: 0,
  dailyGoal: 1000,
  setColor: 'text-on-surface',
  coins: 0,
  level: 1,
  unlockedColors: ['text-on-surface'],
  exp: 0,
  streak: 0,
  longestStreak: 0,
  lastActiveDay: null,
})

export function restore() {
  const raw = localStorage.getItem("data")
  if(!raw) return
  Object.assign(data, JSON.parse(raw))
}
export function saveData() {
  localStorage.setItem("data", JSON.stringify(data));
}
