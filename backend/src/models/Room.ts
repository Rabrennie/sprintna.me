import short from 'short-uuid';
import User from './User';

class Room {
    id: string;
    name: string;
    users: Array<User>;

    constructor(name: string) {
        this.id = short.generate();
        this.name = name;
        this.users = [];
    }

    broadcast(message: object) {
        this.users.forEach((u) => u.socket.send(JSON.stringify(message)));
    }
}

export default Room;
