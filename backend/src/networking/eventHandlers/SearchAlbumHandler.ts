import getSpotifyApiClient from '../../helpers/SpotifyApi';
import Room from '../../models/Room';
import JoinedRoomMessage from '../messages/JoinedRoomMessage';
import Server from '../Server';
import * as ServerEvent from './ServerEvent';


@ServerEvent.register
class SearchAlbumHandler extends ServerEvent.ServerEventHandler {
    static type = 'search-album';

    async handle(server: Server, event: ServerEvent.ServerEvent) {

        const spotifyApi = await getSpotifyApiClient();

        const res = await spotifyApi.searchAlbums(event.data.query);

        this.send({type: 'search-result', data: {results: res.body.albums.items.map(album => ({
            id: album.id,
            url: album.external_urls.spotify,
            imageUrl: album.images[0].url,
            name: album.name,
            artist: album.artists.map(artist => artist.name).join(', ')
        }))}});
    }
}

export default SearchAlbumHandler;

// {"type":"search-album", "data": {"query": "testing"}}
