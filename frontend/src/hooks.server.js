import { prisma } from '$lib/server/prisma';

/** @type {import('@sveltejs/kit').Handle} */
export async function handle({ event, resolve }) {
  // Simple request logging
  console.info(`${event.request.method} ${event.url.pathname}`);

  // Expose prisma via locals (optional convenience)
  event.locals.prisma = prisma;

  // Handle CORS preflight for /api routes
  if (event.request.method === 'OPTIONS' && event.url.pathname.startsWith('/api')) {
    const res = new Response(null, { status: 204 });
    res.headers.set('Access-Control-Allow-Origin', '*');
    res.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.headers.set('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH,DELETE,OPTIONS');
    return res;
  }

  const response = await resolve(event);

  // Basic CORS headers for /api responses
  if (event.url.pathname.startsWith('/api')) {
    response.headers.set('Access-Control-Allow-Origin', '*');
  }

  return response;
}