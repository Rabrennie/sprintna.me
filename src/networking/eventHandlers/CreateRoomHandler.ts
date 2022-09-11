import Room from '../../models/Room';
import JoinedRoomMessage from '../messages/JoinedRoomMessage';
import Server from '../Server';
import * as ServerEvent from './ServerEvent';

@ServerEvent.register
class CreateRoomHandler extends ServerEvent.ServerEventHandler {
    static type = 'create-room';

    handle(server: Server, event: ServerEvent.ServerEvent) {
        const room = new Room(event.data.name);
        server.rooms.set(room.id, room);

        const user = server.clients.get(this.socket);
        room.users.push(user);
        user.room = room;

        this.send(new JoinedRoomMessage(room));
    }
}

export default CreateRoomHandler;

// {"type":"create-room", "data": {"name": "testing"}}
