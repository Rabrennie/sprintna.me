import { writable } from 'svelte/store';
import { io, Socket } from 'socket.io-client';
import type ClientToServerEvents from '../../../../common/ClientToServerEvents';
import type ServerToClientEvents from '../../../../common/ServerToClientEvents';
import type Room from '../../../../common/Room';

interface WebsocketStore {
    connected: boolean;
    socket?: Socket<ServerToClientEvents, ClientToServerEvents>;
}

export const websocketStore = writable<WebsocketStore>({
    connected: false,
    socket: undefined,
});

export const roomStore = writable<Room | undefined>();

const socket: Socket<ServerToClientEvents, ClientToServerEvents> = io('http://localhost:3000', {
    auth: {
        token: '4321',
        name: 'Anonymous',
    },
});
websocketStore.update((value) => ({ ...value, socket }));

socket.on('connect', () => {
    websocketStore.update((value) => ({ ...value, connected: true }));
});

socket.on('room:choices:update', (id, choices) => {
    roomStore.update((room) => {
        if (room?.id === id) {
            return ({...room, choices})
        }

        return room;
    });
});

socket.on('room:state:update', (id, state) => {
    roomStore.update((room) => {
        if (room?.id === id) {
            return ({...room, state})
        }

        return room;
    });
});

socket.onAny((...args) => {
    console.log(args);
});
