import create from 'zustand';

interface RoomState {
    id: string;
    name: string;
    users: Array<any>;
    setId: (id: string) => void;
    setName: (id: string) => void;
    setUsers: (users: Array<any>) => void;
    addRoomUser: (user: any) => void;
}

const useRoomStore = create<RoomState>((set) => ({
    id: '',
    name: '',
    users: [],
    setId: (id: string) => set({ id }),
    setName: (name: string) => set({ name }),
    setUsers: (users: Array<any>) => set({ users }),
    addRoomUser: (user: any) => set((state) => {
        const users = [...state.users];

        if (!users.some(u => u.id === user.id)) {
            users.push(user);
        }

        return { users };
    }),
}));

export default useRoomStore;
