import create from 'zustand';
import { persist } from 'zustand/middleware';

interface UserState {
    token: string | null;
    setToken: (token: string) => void;
}

const useUserStore = create<UserState>()(
    persist(
        (set) => ({
            token: null,
            setToken: (token: string) => set({ token }),
        }),
        { name: 'userState' },
    ),
);

export default useUserStore;
