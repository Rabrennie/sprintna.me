import type User from './User';

export enum RoomState {
    SELECTING = 'selecting',
    ELIMINATING = 'eliminating',
    FINISHED = 'finished'
}

export interface Album {
    artist: string;
    url: string;
    imageUrl: string;
    title: string;
    cssGradient: string;
}

export interface Choice {
    userId: number;
    choice: Album;
    eliminated: boolean;
}

export default interface Room {
    name: string;
    state: RoomState;
    id: number;
    type: 'albums' | 'movies';
    users: User[];
    teamId: number;
    choices: { [key: string]: Choice };
}
