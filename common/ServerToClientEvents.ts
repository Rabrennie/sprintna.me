import { Choice, RoomState } from "./Room";

export default interface ServerToClientEvents {
    'room:users:update': (id: string, users: string[]) => void;
    'room:choices:update': (id: string, choices: { [key: string]: Choice }) => void;
    'room:state:update': (id: string, state: RoomState) => void;
    'room:album:eliminated': (id: string, choice: Choice) => void;
}
