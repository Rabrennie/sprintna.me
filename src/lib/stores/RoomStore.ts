import { writable } from 'svelte/store';
import type Room from '../../types/Room';
import type { RoomEvents } from '../room/events';
import { RoomState, type Choice } from '../../types/Room';

const { subscribe, update, set } = writable<Room | undefined>();

const onUsersUpdate = (data: RoomEvents['room:users:update']) => {
    update((room) => {
        if (!room) {
            return room;
        }

        return { ...room, users: data.users };
    });
};

const onStateUpdate = (data: RoomEvents['room:state:update']) => {
    update((room) => {
        if (!room) {
            return room;
        }

        return { ...room, state: data.state };
    });
};

const onChoicesUpdate = (data: RoomEvents['room:choices:update']) => {
    update((room) => {
        if (!room) {
            return room;
        }

        return {
            ...room,
            choices: {
                ...room.choices,
                ...Object.fromEntries(data.choices.map((c) => [c.userId, c]))
            }
        };
    });
};

const onEliminated = (data: RoomEvents['room:album:eliminated']) => {
    update((room) => {
        if (!room) {
            return room;
        }

        const choices: Record<number, Choice> = {
            ...room.choices,
            [data.userId]: { ...room.choices[data.userId], eliminated: true }
        };

        const state =
            Object.values(choices).filter((c) => !c.eliminated).length === 1
                ? RoomState.FINISHED
                : RoomState.ELIMINATING;

        return {
            ...room,
            choices,
            state
        };
    });
};

export const roomStore = {
    subscribe,
    set,
    onUsersUpdate,
    onStateUpdate,
    onChoicesUpdate,
    onEliminated
};
