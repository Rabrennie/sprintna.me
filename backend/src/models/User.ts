import short from 'short-uuid';
import { WebSocket } from 'ws';
import Room from './Room';

class User {
    id: string;
    name?: string;
    room?: Room;
    socket: WebSocket;

    constructor(socket: WebSocket, id?: string) {
        this.id = id ?? short.generate();
        this.socket = socket;
    }
}

export default User;
