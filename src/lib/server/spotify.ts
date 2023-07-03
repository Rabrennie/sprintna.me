import { env } from '$env/dynamic/private';

export const getToken = async () => {
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

export const search = async (
    query: string,
    token: string
): Promise<SpotifyApi.AlbumSearchResponse> => {
    const params = new URLSearchParams({ q: query, type: 'album', market: 'GB' });
    const res = await fetch(`https://api.spotify.com/v1/search?${params}`, {
        headers: new Headers({
            Authorization: `Bearer ${token}`
        }),
        method: 'GET'
    });

    return await res.json();
};

export const singleAlbum = async (
    albumId: string,
    token: string
): Promise<SpotifyApi.SingleAlbumResponse> => {
    const res = await fetch(`https://api.spotify.com/v1/albums/${albumId}`, {
        headers: new Headers({
            Authorization: `Bearer ${token}`
        }),
        method: 'GET'
    });

    return await res.json();
};

export const playlist = async (
    playlistId: string,
    token: string
): Promise<SpotifyApi.PlaylistTrackResponse> => {
    const params = new URLSearchParams({ limit: '50' });
    const res = await fetch(`https://api.spotify.com/v1/playlists/${playlistId}/tracks?${params}`, {
        headers: new Headers({
            Authorization: `Bearer ${token}`
        }),
        method: 'GET'
    });

    return await res.json();
};
