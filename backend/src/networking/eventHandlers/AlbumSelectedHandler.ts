import getSpotifyApiClient from '../../helpers/SpotifyApi';
import Room from '../../models/Room';
import JoinedRoomMessage from '../messages/JoinedRoomMessage';
import Server from '../Server';
import * as ServerEvent from './ServerEvent';

@ServerEvent.register
class AlbumSelectedHandler extends ServerEvent.ServerEventHandler {
    static type = 'album-selected';

    async handle(server: Server, event: ServerEvent.ServerEvent) {
        const spotifyApi = await getSpotifyApiClient();
        const res = await spotifyApi.getAlbum(event.data.id);

        const user = server.clients.get(this.socket);

        const album = res.body;
        const albumData = {
            id: album.id,
            url: album.external_urls.spotify,
            imageUrl: album.images[0].url,
            name: album.name,
            artist: album.artists.map((artist) => artist.name).join(', '),
        };
        user.room.setSelection(user, albumData);

        user.room.broadcast({type: 'album-selected', data: {album: albumData, user: { id: user.id }}})
    }
}

export default AlbumSelectedHandler;

// {"type":"search-album", "data": {"query": "testing"}}
