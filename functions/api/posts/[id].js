const PW = 'bingotown';

export async function onRequestDelete({ params, request, env }) {
  if (request.headers.get('X-Auth') !== PW)
    return new Response('unauthorized', { status: 401 });
  let posts = await env.POSTS.get('posts', { type: 'json' }) || [];
  posts = posts.filter(p => p.id !== params.id);
  await env.POSTS.put('posts', JSON.stringify(posts));
  return new Response('ok');
}

export async function onRequestOptions() {
  return new Response(null, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, X-Auth',
    }
  });
}
