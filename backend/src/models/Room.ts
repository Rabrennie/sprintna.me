import short from 'short-uuid';
import User from './User';

class Room {
    id: string;
    name: string;
    users: Array<User>;
    selections: Map<string, any>;

    constructor(name: string) {
        this.id = short.generate();
        this.name = name;
        this.users = [];
        this.selections = new Map();
    }

    broadcast(message: object) {
        this.users.forEach((u) => {
            u.socket.send(JSON.stringify(message))
        });
    }

    setSelection(user: User, selection: any) {
        this.selections.set(user.id, selection);
    }
}

export default Room;
