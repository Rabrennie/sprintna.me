import { writable } from 'svelte/store';
import { io, Socket } from 'socket.io-client';
import type ClientToServerEvents from '../../../../common/ClientToServerEvents';
import type ServerToClientEvents from '../../../../common/ServerToClientEvents';
import type Room from '../../../../common/Room';
import { browser } from '$app/environment';

interface WebsocketStore {
	connected: boolean;
	socket?: Socket<ServerToClientEvents, ClientToServerEvents>;
}

export const websocketStore = writable<WebsocketStore>({
	connected: false,
	socket: undefined
});

export const roomStore = writable<Room | undefined>();

if (browser) {
	let token = localStorage.getItem('token');
	if (!token) {
		token = crypto.randomUUID();
		localStorage.setItem('token', token);
	}

	let name = localStorage.getItem('name');
	if (!name) {
		name = 'Anonymous';
	}
	const socket: Socket<ServerToClientEvents, ClientToServerEvents> = io(
		`${window.location.protocol}//${window.location.host}/`,
		{
			auth: {
				token: token,
				name: name
			}
		}
	);
	websocketStore.update((value) => ({ ...value, socket }));

	socket.on('connect', () => {
		websocketStore.update((value) => ({ ...value, connected: true }));
	});

	socket.on('room:choices:update', (id, choices) => {
		roomStore.update((room) => {
			if (room?.id === id) {
				return { ...room, choices };
			}

			return room;
		});
	});

	socket.on('room:state:update', (id, state) => {
		roomStore.update((room) => {
			if (room?.id === id) {
				return { ...room, state };
			}

			return room;
		});
	});

	socket.on('room:users:update', (id, users) => {
		roomStore.update((room) => {
			if (room?.id === id) {
				return { ...room, users };
			}

			return room;
		});
	});

	socket.onAny((...args) => {
		console.log(args);
	});
}
