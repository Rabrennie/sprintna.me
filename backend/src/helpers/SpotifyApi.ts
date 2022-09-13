import {default as SpotifyWebApi} from 'spotify-web-api-node';

export default async function getSpotifyApiClient() {
    const spotifyApi = new SpotifyWebApi({
        clientId: process.env.SPOTIFY_CLIENT_ID,
        clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
    });

    const credentialsResponse = await spotifyApi.clientCredentialsGrant()
    spotifyApi.setAccessToken(credentialsResponse.body['access_token'])

    return spotifyApi;
}
