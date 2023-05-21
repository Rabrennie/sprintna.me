import { env } from '$env/dynamic/private';
import type { RequestHandler } from './$types';

const getToken = async () => {
    const token = Buffer.from(`${env.SPOTIFY_CLIENT_ID}:${env.SPOTIFY_CLIENT_SECRET}`).toString(
        'base64'
    );

    const params = new URLSearchParams({ grant_type: 'client_credentials' });
    const res = await fetch(`https://accounts.spotify.com/api/token`, {
        body: params,
        headers: new Headers({
            'Content-Type': 'application/x-www-form-urlencoded',
            Authorization: `Basic ${token}`
        }),
        method: 'POST'
    });

    const data = await res.json();

    return data.access_token;
};

const search = async (query: string, token: string) : Promise<SpotifyApi.AlbumSearchResponse> => {
    const params = new URLSearchParams({ q: query, type: 'album', market: 'GB' });
    const res = await fetch(`https://api.spotify.com/v1/search?${params}`, {
        headers: new Headers({
            Authorization: `Bearer ${token}`
        }),
        method: 'GET'
    });

    return await res.json();
};

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
