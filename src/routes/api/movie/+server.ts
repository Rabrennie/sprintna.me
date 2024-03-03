import * as OMDb from '$lib/server/omdb';

import type { RequestHandler } from './$types';

export const GET = (async ({ url }) => {
    const id = String(url.searchParams.get('id'));

    if (!id) {
        return new Response('No id', { status: 400 });
    }

    const token = await OMDb.getToken();
    const result = await OMDb.singleMovie(id, token);

    return new Response(JSON.stringify(result), {
        headers: {
            'Content-Type': 'application/json'
        }
    });
}) satisfies RequestHandler;
