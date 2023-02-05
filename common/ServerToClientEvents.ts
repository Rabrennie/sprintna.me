import type { Choice, RoomState } from "./Room";
import type User from './User';

export default interface ServerToClientEvents {
    'room:users:update': (id: string, users: User[]) => void;
    'room:choices:update': (id: string, choices: { [key: string]: Choice }) => void;
    'room:state:update': (id: string, state: RoomState) => void;
    'room:album:eliminated': (id: string, choice: Choice) => void;
    'session': (user: User) => void;
}
