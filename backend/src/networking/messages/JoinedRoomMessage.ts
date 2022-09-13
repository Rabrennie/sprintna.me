import Room from '../../models/Room';
import BaseMessage from './BaseMessage';

class JoinedRoomMessage extends BaseMessage {
    type = 'joined-room';
    room: Room;

    constructor(room: Room) {
        super();
        this.room = room;
    }

    getMessageData() {
        return { ...this.room, selections: Object.fromEntries(this.room.selections), users: this.room.users.map((u) => ({ id: u.id, name: u.name })) };
    }
}

export default JoinedRoomMessage;
