import { getToken, search } from '$lib/server/spotify';
import type { RequestHandler } from './$types';

export const GET = (async ({ url }) => {
    const query = String(url.searchParams.get('q'));

    const token = await getToken();
    const results = await search(query, token);

    return new Response(JSON.stringify(results.albums.items), {
        headers: {
            'Content-Type': 'application/json'
        }
    });
}) satisfies RequestHandler;
