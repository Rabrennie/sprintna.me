import { Server } from 'socket.io';
import type ClientToServerEvents from '../../types/ClientToServerEvents';
import type ServerToClientEvents from '../../types/ServerToClientEvents';
import type Room from '../../types/Room';
import { RoomState } from '../../types/Room';
import crypto from 'crypto';
import type User from '../../types/User';
import { db } from './database';
import type { Prisma } from '@prisma/client';
import { parse } from 'cookie';
import * as jose from 'jose';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface InterServerEvents {}

export interface SocketData {
    user: User;
}

export const rooms: { [key: string]: Room } = {};

export const createServer = (AUTH_SECRET?: string) => {
    if (!AUTH_SECRET) {
        throw 'auth secret not defined';
    }

    const io = new Server<
        ClientToServerEvents,
        ServerToClientEvents,
        InterServerEvents,
        SocketData
    >({
        cors: {
            origin: 'https://sprintna.me'
        }
    });

    io.use(async (socket, next) => {
        const cookies = parse(socket.handshake.headers.cookie ?? '');

        if (!cookies.jwt) {
            socket.disconnect();
            return;
        }

        const key = Buffer.from(AUTH_SECRET, 'hex');

        try {
            const verified = await jose.jwtVerify(cookies.jwt, key, {
                issuer: 'https://sprintna.me',
                algorithms: ['HS256'],
                requiredClaims: [
                    'providerId',
                    'provider',
                    'username',
                    'name',
                    'email',
                    'sub',
                    'iss',
                    'exp'
                ]
            });

            const dbUser = await db.user.findUnique({
                where: {
                    provider_providerId: {
                        provider: verified.payload.provider as string,
                        providerId: verified.payload.providerId as string
                    }
                }
            });

            if (!dbUser) {
                throw 'nope';
            }

            socket.data.user = { id: dbUser.id, name: dbUser.name };
        } catch (e) {
            console.log(e);
            socket.disconnect();
            return;
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

        socket.on('room:join', async (roomId, callback) => {
            let room = rooms[roomId];

            if (!room) {
                const dbRoom = await db.room.findFirst({
                    where: { linkId: roomId },
                    include: { choices: { include: { user: true } } }
                });
                if (!dbRoom) {
                    return;
                }
                room = {
                    id: roomId,
                    name: dbRoom.name,
                    state: [RoomState.SELECTING, RoomState.ELIMINATING, RoomState.FINISHED][
                        dbRoom.step
                    ],
                    users: dbRoom.choices.map((c) => ({ id: c.userId, name: c.user.name })),
                    choices: Object.fromEntries(
                        dbRoom.choices.map((c) => [
                            c.userId,
                            {
                                user: c.userId,
                                choice: {
                                    artist: c.albumArtist,
                                    title: c.albumName,
                                    imageUrl: c.albumImage,
                                    url: `https://open.spotify.com/album/${c.albumId}`
                                },
                                eliminated: c.eliminated
                            }
                        ])
                    )
                };

                rooms[roomId] = room;
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
                    eliminated: false
                };

                const dbRoom = await db.room.findFirst({ where: { linkId: roomId } });
                if (!dbRoom) {
                    return;
                }

                const data: Prisma.ChoiceUpdateArgs['data'] | Prisma.ChoiceCreateArgs['data'] = {
                    roomId: dbRoom.id,
                    userId: (socket.data.user as User).id,
                    albumId: album.url.split('/')[album.url.split('/').length - 1],
                    albumImage: album.imageUrl,
                    albumArtist: album.artist,
                    albumName: album.title,
                    eliminated: false
                };

                const dbChoice = await db.choice.findFirst({
                    where: {
                        roomId: dbRoom.id,
                        userId: (socket.data.user as User).id
                    }
                });

                if (dbChoice) {
                    await db.choice.update({
                        where: { id: dbChoice.id },
                        data
                    });
                } else {
                    await db.choice.create({
                        data: data as Prisma.ChoiceCreateArgs['data']
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
                const dbRoom = await db.room.findFirst({ where: { linkId: roomId } });
                if (!dbRoom) {
                    return;
                }
                const dbChoice = await db.choice.findFirst({
                    where: {
                        roomId: dbRoom.id,
                        userId: (socket.data.user as User).id
                    }
                });
                if (!dbChoice) {
                    return;
                }
                await db.choice.update({
                    where: {
                        id: dbChoice.id
                    },
                    data: {
                        eliminated: true
                    }
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

    return io;
};
