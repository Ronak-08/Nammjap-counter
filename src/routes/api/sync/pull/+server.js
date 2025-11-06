export async function GET({ cookies }) {
  const apiKey = cookies.get("jsonbin_key");
  const binId = cookies.get("jsonbin_bin");
  if(!apiKey || !binId ) { return new Response("missing", {status: 400}); }
  const r = await fetch(`https://api.jsonbin.io/v3/b/${binId}/latest`, {
    headers: {
      'X-Master-Key': apiKey
    }
  })

  if (!r.ok) return new Response("jsonbin error", { status: 500 });

  const j = await r.json(); 
  return new Response(JSON.stringify(j.record), {
    headers: { "content-type": "application/json" }
  });
}
