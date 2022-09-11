import ErrorMessage from '../messages/ErrorMessage';
import JoinedRoomMessage from '../messages/JoinedRoomMessage';
import UserJoinedMessage from '../messages/UserJoinedMessage';
import Server from '../Server';
import * as ServerEvent from './ServerEvent';

@ServerEvent.register
class JoinRoomHandler extends ServerEvent.ServerEventHandler {
    static type = 'join-room';

    handle(server: Server, event: ServerEvent.ServerEvent) {
        const room = server.rooms.get(event.data.id);

        if (!room) {
            this.send(new ErrorMessage('Room does not exist'));
            return;
        }

        const user = server.clients.get(this.socket);

        if (!room.users.some((u) => u.id === user.id)) {
            room.users.push(user);
        }

        user.room = room;

        this.send(new JoinedRoomMessage(room));
        room.broadcast(new UserJoinedMessage(user));
    }
}

export default JoinRoomHandler;

// {"type":"join-room", "data": {"id": "123"}}
