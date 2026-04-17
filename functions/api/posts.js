const PW = 'bingotown';

export async function onRequestGet({ env }) {
  const posts = await env.POSTS.get('posts', { type: 'json' }) || [];
  return new Response(JSON.stringify(posts), {
    headers: { 'Content-Type': 'application/json' }
  });
}

export async function onRequestPost({ request, env }) {
  if (request.headers.get('X-Auth') !== PW)
    return new Response('unauthorized', { status: 401 });
  const post = await request.json();
  const posts = await env.POSTS.get('posts', { type: 'json' }) || [];
  post.id = Date.now().toString();
  posts.unshift(post);
  await env.POSTS.put('posts', JSON.stringify(posts));
  return new Response(JSON.stringify(post), {
    headers: { 'Content-Type': 'application/json' }
  });
}

export async function onRequestOptions() {
  return new Response(null, { headers: corsHeaders() });
}

function corsHeaders() {
  return {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, X-Auth',
  };
}
