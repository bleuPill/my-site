const MAX_ENTRIES = 100;
const RETURN_LIMIT = 50;

export async function onRequestGet({ env }) {
  const board = await env.POSTS.get('leaderboard', { type: 'json' }) || [];
  return new Response(JSON.stringify(board.slice(0, RETURN_LIMIT)), {
    headers: { 'Content-Type': 'application/json' }
  });
}

export async function onRequestPost({ request, env }) {
  let body;
  try { body = await request.json(); } catch { return new Response('bad json', { status: 400 }); }

  const level = Number(body.level);
  if (!Number.isInteger(level) || level < 1 || level > 9999) {
    return new Response('bad level', { status: 400 });
  }
  const name = String(body.name || '').toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 3) || '???';

  const board = await env.POSTS.get('leaderboard', { type: 'json' }) || [];
  board.push({ name, level, ts: Date.now() });
  board.sort((a, b) => b.level - a.level || a.ts - b.ts);
  const trimmed = board.slice(0, MAX_ENTRIES);
  await env.POSTS.put('leaderboard', JSON.stringify(trimmed));

  return new Response(JSON.stringify(trimmed.slice(0, RETURN_LIMIT)), {
    headers: { 'Content-Type': 'application/json' }
  });
}
