import * as Spotify from '$lib/server/spotify';
import * as OMDb from '$lib/server/omdb';

import type { RequestHandler } from './$types';

export const GET = (async ({ url }) => {
    const query = String(url.searchParams.get('q'));
    const type = String(url.searchParams.get('type'));

    if (!query) {
        return new Response('No query', { status: 400 });
    } else if (!type) {
        return new Response('No type', { status: 400 });
    }

    if (type === 'albums') {
        const token = await Spotify.getToken();
        const results = await Spotify.search(query, token);

        return new Response(JSON.stringify(results.albums.items), {
            headers: {
                'Content-Type': 'application/json'
            }
        });
    } else if (type === 'movies') {
        const token = await OMDb.getToken();
        const results = await OMDb.search(query, token);

        return new Response(JSON.stringify(results.Search), {
            headers: {
                'Content-Type': 'application/json'
            }
        });
    }

    return new Response('Invalid type', { status: 400 });
}) satisfies RequestHandler;
