import { JSONBIN_MASTER_KEY, JSONBIN_BIN_ID, SYNC_PASSWORD } from "$env/static/private";

export async function POST({ request }) {
  const body = await request.json();
  const pass = await request.headers.get("X-sync-password");
  if (pass !== SYNC_PASSWORD) {
    return new Response("forbidden", { status: 403 });
  }
  await fetch(`https://api.jsonbin.io/v3/b/${JSONBIN_BIN_ID}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      "X-Master-Key": JSONBIN_MASTER_KEY
    },
    body: JSON.stringify(body)
  });

  return new Response("ok");
}
