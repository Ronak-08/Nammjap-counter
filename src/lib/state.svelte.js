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

export async function sync(pass) {
  await fetch("/api/sync", {
    method: "POST",
    headers: {
      "X-sync-password": pass
    },
    body: JSON.stringify(data) 
  })
}

export async function pullFromServer(pass) {
  const r = await fetch("/api/sync/pull", {
    headers: { "X-sync-password": pass }
  });
  if (!r.ok) return;

  const serverData = await r.json();
  Object.assign(data, serverData);
  saveData()
}

