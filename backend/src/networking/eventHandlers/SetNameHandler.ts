import Server from '../Server';
import * as ServerEvent from './ServerEvent';

@ServerEvent.register
class SetNameHandler extends ServerEvent.ServerEventHandler {
    static type = "set-name";

    handle(server: Server,event: ServerEvent.ServerEvent) {
        const user = server.clients.get(this.socket);
        user.name = event.data.name

        console.log(user);

        // TODO: broadcast name change to room if in any
    }
}

export default SetNameHandler;

// {"type":"set-name", "data": {"name": "testing"}}
