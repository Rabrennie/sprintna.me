import { WebSocket } from "ws";
import Server from "../Server";

export interface ServerEvent {
    type: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    data: any;
}

export abstract class ServerEventHandler {
    static type: string;
    socket: WebSocket;

    constructor(socket: WebSocket) {
        this.socket = socket;
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    send(data: any) {
        this.socket.send(JSON.stringify(data));
    }

    abstract handle(server: Server, event: ServerEvent);
}

type Constructor<T> = {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    new (...args: any[]): T;
    readonly prototype: T;
    readonly type: string;
};
const implementations: Constructor<ServerEventHandler>[] = [];
export function GetEventHandlers(): Constructor<ServerEventHandler>[] {
    return implementations;
}
export function register<T extends Constructor<ServerEventHandler>>(ctor: T) {
    implementations.push(ctor);
    return ctor;
}

export default ServerEvent;
