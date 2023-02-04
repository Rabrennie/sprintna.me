import Room from './Room';

export default interface ClientToServerEvents {
    'room:create': (name: string, callback: (room: Room) => void) => void;
    'room:join': (roomId: string, callback: (room: Room) => void) => void;
    'room:proceed': (roomId: string, callback: () => void) => void;
    'room:album:select': (roomId: string, albumId: string, callback: () => void) => void;
    'room:album:eliminate': (roomId: string, callback: () => void) => void;
}
