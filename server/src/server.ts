import { Server } from 'socket.io';
import ClientToServerEvents from '../../common/ClientToServerEvents';
import ServerToClientEvents from '../../common/ServerToClientEvents';
import Room, { RoomState } from '../../common/Room';
import crypto from 'crypto';
import User from '../../common/User';

export interface InterServerEvents {}

export interface SocketData {
    user: User;
}

export const rooms: { [key: string]: Room } = {};

export const io = new Server<ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData>({
    cors: {
        origin: 'http://localhost:5173',
    },
});

export const sessions: { [key: string]: User } = {};

io.use((socket, next) => {
    console.log(socket.id);

    const token = socket.handshake.auth.token;
    let user: User;

    if (sessions[token]) {
        user = sessions[token];
        user.name = socket.handshake.auth.name;
    } else {
        user = { id: crypto.randomUUID(), name: socket.handshake.auth.name };
        sessions[token] = user;
    }

    if (user) {
        socket.data.user = user;
    }

    next();
});

io.on('connection', (socket) => {
    console.log(socket.id);

    if (socket.data.user) {
        socket.emit('session', socket.data.user);
    } else {
        socket.disconnect();
    }

    socket.on('room:create', (name, callback) => {
        const id = crypto.randomBytes(16).toString('base64url');
        rooms[id] = {
            name,
            state: RoomState.SELECTING,
            id,
            users: [socket.data.user as User],
            choices: {},
        };
        socket.join(id);
        callback(rooms[id]);
    });

    socket.on('room:join', (roomId, callback) => {
        rooms[roomId].users.push(socket.data.user as User);
        socket.join(roomId);
        io.to(roomId).emit('room:users:update', roomId, rooms[roomId].users);
        callback(rooms[roomId]);
    });

    socket.on('room:album:select', (roomId, albumId, callback) => {
        const room = rooms[roomId];

        if (room.state == RoomState.SELECTING) {
            room.choices[(socket.data.user as User).id] = { user: (socket.data.user as User).id, choice: albumId, eliminated: false };
            io.to(roomId).emit('room:choices:update', roomId, room.choices);
        }

        callback();
    });

    socket.on('room:album:eliminate', (roomId, callback) => {
        const room = rooms[roomId];

        const choices = Object.values(room.choices).filter((c) => !c.eliminated);

        if (choices.length >= 2) {
            const choice = choices[crypto.randomInt(choices.length - 1)];
            choice.eliminated = true;
            io.to(roomId).emit('room:album:eliminated', roomId, choice);
        }

        if (choices.length <= 2) {
            room.state = RoomState.FINISHED;
            io.to(roomId).emit('room:state:update', roomId, room.state);
        }

        callback();
    });

    socket.on('room:proceed', (roomId, callback) => {
        const room = rooms[roomId];

        if (room.state === RoomState.SELECTING) {
            room.state = RoomState.ELIMINATING;
            io.to(roomId).emit('room:state:update', roomId, room.state);
        }

        callback();
    });
});
