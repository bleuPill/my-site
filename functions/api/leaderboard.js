const PW = 'bingotown';

export async function onRequestGet({ env }) {
  const board = await env.POSTS.get('leaderboard', { type: 'json' }) || [];
  return new Response(JSON.stringify(board), {
    headers: { 'Content-Type': 'application/json', ...corsHeaders() }
  });
}

export async function onRequestPost({ request, env }) {
  const { name, level } = await request.json();
  if (!name || typeof level !== 'number' || level < 1)
    return new Response('bad request', { status: 400 });

  const clean = name.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 3);
  if (!clean) return new Response('bad request', { status: 400 });

  const board = await env.POSTS.get('leaderboard', { type: 'json' }) || [];
  board.push({ name: clean, level });
  board.sort((a, b) => b.level - a.level);
  const top = board.slice(0, 10);
  await env.POSTS.put('leaderboard', JSON.stringify(top));

  return new Response(JSON.stringify(top), {
    headers: { 'Content-Type': 'application/json', ...corsHeaders() }
  });
}

export async function onRequestOptions() {
  return new Response(null, { headers: corsHeaders() });
}

function corsHeaders() {
  return {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  };
}
