import { JSONBIN_MASTER_KEY, JSONBIN_BIN_ID, SYNC_PASSWORD } from "$env/static/private";

export async function GET({ request }) {
  const pass = request.headers.get('X-sync-password');

  if (pass !== SYNC_PASSWORD) {
    return new Response("forbidden", { status: 403 });
  }

  const r = await fetch(`https://api.jsonbin.io/v3/b/${JSONBIN_BIN_ID}/latest`, {
    headers: {
      'X-Master-Key': JSONBIN_MASTER_KEY
    }
  })

  if (!r.ok) return new Response("jsonbin error", { status: 500 });

  const j = await r.json(); 
  return new Response(JSON.stringify(j.record), {
    headers: { "content-type": "application/json" }
  });
}
