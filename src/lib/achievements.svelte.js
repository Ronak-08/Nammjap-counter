export let achievements = $state([
  { id: 1, text: "Do 1k jap",     countReq: 1_000,   completed: false, colorUnlocked: "text-red-500" },
  { id: 2, text: "Do 2k jap",     countReq: 2_000,   completed: false, colorUnlocked: "text-orange-500" },
  { id: 3, text: "Do 5k jap",     countReq: 5_000,   completed: false, colorUnlocked: "text-blue-500" },
  { id: 4, text: "Do 10k jap",    countReq: 10_000,  completed: false, colorUnlocked: "text-purple-500" },
  { id: 5, text: "Do 25k jap",    countReq: 25_000,  completed: false, colorUnlocked: "text-green-500" },
  { id: 6, text: "Do 50k jap",    countReq: 50_000,  completed: false, colorUnlocked: "text-pink-500" },
  { id: 7, text: "Do 100k jap",   countReq: 100_000, completed: false, colorUnlocked: "text-yellow-500" },
  { id: 8, text: "Do 200k jap",   countReq: 200_000, completed: false, colorUnlocked: "text-gold-500" },
])

export function updateAchievements(count) {
  achievements.forEach(e => {
    e.completed = count >= e.countReq
  })
}
