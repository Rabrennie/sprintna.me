import type Room from './Room';
import type { Album } from './Room';

export default interface ClientToServerEvents {
    'room:join': (roomId: string, callback: (room: Room) => void) => void;
    'room:proceed': (roomId: string, callback: () => void) => void;
    'room:album:select': (roomId: string, album: Album, callback: () => void) => void;
    'room:album:eliminate': (roomId: string, callback: () => void) => void;
}
