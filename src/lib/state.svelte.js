export let data = $state({
  count: 0,
  dailyCount: 0,
  dailyGoal: 1000,
  setColor: null,
})

export function restore() {
  const raw = localStorage.getItem("data")
  if(!raw) return
  Object.assign(data, JSON.parse(raw))
}
export function saveData() {
  localStorage.setItem("data", JSON.stringify(data))
}

export async function sync() {
  const { dailyCount, ...dataToSync } = data; 
  await fetch("/api/sync", {
    method: "POST",
    body: JSON.stringify(dataToSync)
  });
}

export async function pullFromServer() {
  const r = await fetch("/api/sync/pull");
  if (!r.ok) return;

  const serverData = await r.json();
  Object.assign(data, serverData);
  saveData();
}
