import create from 'zustand';

interface RoomState {
    id: string;
    name: string;
    users: Array<any>;
    selections: any;
    setId: (id: string) => void;
    setName: (id: string) => void;
    setUsers: (users: Array<any>) => void;
    setSelections: (selections: any) => void;
    setSelection: (id: string, selection: any) => void;
    addRoomUser: (user: any) => void;
}

const useRoomStore = create<RoomState>((set) => ({
    id: '',
    name: '',
    users: [],
    selections: {},
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
    setSelections: (selections: any) => set({selections: selections}),
    setSelection: (id: string, selection: any) => set((state) => {
        const selections = {...state.selections};

        selections[id] = selection;

        return { selections };
    }),
}));

export default useRoomStore;
