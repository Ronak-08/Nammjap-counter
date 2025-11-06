export async function POST({ cookies }) {
  const apiKey = cookies.get("jsonbin_key");
  const binId = cookies.get("jsonbin_bin");

  if(!apiKey || !binId) { return new Response("missing", {status: 400}); }
  const body = await request.json();
  await fetch(`https://api.jsonbin.io/v3/b/${binId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      "X-Master-Key": apiKey
    },
    body: JSON.stringify(body)
  });

  return new Response("ok");
}
