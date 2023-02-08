import { Server } from 'socket.io';
import ClientToServerEvents from '../../common/ClientToServerEvents';
import ServerToClientEvents from '../../common/ServerToClientEvents';
import Room, { RoomState } from '../../common/Room';
import crypto from 'crypto';
import User from '../../common/User';
import { db } from './db';

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

    socket.on('room:create', async (name, callback) => {
        const id = crypto.randomBytes(16).toString('base64url');
        rooms[id] = {
            name,
            state: RoomState.SELECTING,
            id,
            users: [socket.data.user as User, { id: 'aaaa', name: 'aaaa' }, { id: 'bbbb', name: 'bbbb' }],
            choices: {},
        };
        await db.rooms.create({
            data: {
                link_id: id,
                name,
                created_at: new Date(),
            },
        });

        socket.join(id);
        callback(rooms[id]);
    });

    socket.on('room:join', async (roomId, callback) => {
        const room = rooms[roomId];

        if (!room) {
            const dbRoom = await db.rooms.findFirst({ where: { link_id: roomId }, include: { choices: true } });
            if (!dbRoom) {
                return;
            }
            rooms[roomId] = {
                id: roomId,
                name: dbRoom.name,
                state: [RoomState.SELECTING, RoomState.ELIMINATING, RoomState.FINISHED][dbRoom.step],
                users: dbRoom.choices.map((c) => ({ id: c.user_name, name: 'Anonymous' })),
                choices: Object.fromEntries(
                    dbRoom.choices.map((c) => [
                        c.user_name,
                        {
                            user: c.user_name,
                            choice: {
                                artist: c.album_artist,
                                title: c.album_name,
                                imageUrl: c.album_image,
                                url: `https://open.spotify.com/album/${c.album_id}`,
                            },
                            eliminated: c.eliminated,
                        },
                    ]),
                ),
            };
            return;
        }

        socket.join(roomId);

        if (!room.users.find((u) => u.id === (socket.data.user as User).id)) {
            room.users.push(socket.data.user as User);
            io.to(roomId).emit('room:users:update', roomId, room.users);
        }

        callback(rooms[roomId]);
    });

    socket.on('room:album:select', async (roomId, album, callback) => {
        const room = rooms[roomId];

        if (room.state == RoomState.SELECTING) {
            room.choices[(socket.data.user as User).id] = {
                user: (socket.data.user as User).id,
                choice: album,
                eliminated: false,
            };

            const dbRoom = await db.rooms.findFirst({ where: { link_id: roomId } });
            if (!dbRoom) {
                return;
            }

            const data = {
                room_id: dbRoom.id,
                user_name: (socket.data.user as User).id,
                album_id: album.url.split('/')[album.url.split('/').length - 1],
                album_image: album.imageUrl,
                album_artist: album.artist,
                album_name: album.title,
                created_at: new Date(),
                eliminated: false,
            };

            const dbChoice = await db.choices.findFirst({
                where: {
                    room_id: dbRoom.id,
                    user_name: (socket.data.user as User).id,
                },
            });

            if (dbChoice) {
                await db.choices.update({
                    where: { id: dbChoice.id },
                    data,
                });
            } else {
                await db.choices.create({
                    data,
                });
            }

            io.to(roomId).emit('room:choices:update', roomId, room.choices);
        }

        callback();
    });

    socket.on('room:album:eliminate', async (roomId, callback) => {
        const room = rooms[roomId];

        const choices = Object.values(room.choices).filter((c) => !c.eliminated);

        if (choices.length >= 2) {
            const choice = choices[crypto.randomInt(choices.length)];
            choice.eliminated = true;
            const dbRoom = await db.rooms.findFirst({ where: { link_id: roomId } });
            if (!dbRoom) {
                return;
            }
            const dbChoice = await db.choices.findFirst({
                where: {
                    room_id: dbRoom.id,
                    user_name: (socket.data.user as User).id,
                },
            });
            if (!dbChoice) {
                return;
            }
            await db.choices.update({
                where: {
                    id: dbChoice.id,
                },
                data: {
                    eliminated: true,
                },
            });
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
