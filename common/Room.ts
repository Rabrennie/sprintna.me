export enum RoomState {
    SELECTING = 'selecting',
    ELIMINATING = 'eliminating',
    FINISHED = 'finished',
}

export interface Choice {
    user: string,
    choice: string,
    eliminated: boolean;
}

export default interface Room {
    name: string;
    state: RoomState;
    id: string;
    users: string[];
    choices: { [key: string]: Choice };
}
