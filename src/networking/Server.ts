import { WebSocket, Server as WsServer } from 'ws';
import Room from '../models/Room';
import User from '../models/User';
import * as ServerEvent from './eventHandlers/ServerEvent';
import TokenManager from '../helpers/TokenManager';

class Server {
    port: number;
    websocketServer: WsServer;
    clients: Map<WebSocket, User>;
    rooms: Map<string, Room>;
    tokenManager: TokenManager;

    constructor(port: number) {
        this.port = port;
        this.clients = new Map();
        this.rooms = new Map();
        this.tokenManager = new TokenManager();
    }

    start() {
        this.websocketServer = new WebSocket.Server({ port: this.port });

        this.websocketServer.on('connection', (socket: WebSocket, req) => {
            const { id, token } = this.tokenManager.getIdForRequest(req);

            socket.send(JSON.stringify({ type: 'set-token', data: { token: token } }));

            this.clients.set(socket, new User(socket, id));

            socket.on('message', (message: string) => this.handleMessage(socket, message));
            socket.on('close', () => this.handleClose(socket));
        });
    }

    handleMessage(socket: WebSocket, message: string) {
        try {
            const data = JSON.parse(message);
            const events = ServerEvent.GetEventHandlers();

            const handler = events.find((e) => e.type === data.type);

            if (handler) {
                new handler(socket).handle(this, data);
            }
        } catch (error) {
            console.log(error);
            console.log(`Failed to parse message: ${message}`);
        }
    }

    handleClose(socket: WebSocket) {
        console.log(`Client disconnected: ${this.clients.get(socket)?.id}`);
        this.clients.delete(socket);
    }
}

export default Server;
