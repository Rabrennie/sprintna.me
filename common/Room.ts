import type User from './User';

export enum RoomState {
    SELECTING = 'selecting',
    ELIMINATING = 'eliminating',
    FINISHED = 'finished',
}

export interface Album {
    artist: string;
    url: string;
    imageUrl: string;
    title: string;
}

export interface Choice {
    user: string;
    choice: Album;
    eliminated: boolean;
}

export default interface Room {
    name: string;
    state: RoomState;
    id: string;
    users: User[];
    choices: { [key: string]: Choice };
}
