import React, { ReactNode } from 'react';
import useWebSocket from 'react-use-websocket';
import useUserStore from './stores/UserStore';

interface Props {
    children?: ReactNode;
}

export default function App({ children }: Props) {
    let token = useUserStore((state) => state.token);

    useWebSocket(`ws://localhost:4321/${token ? '?token=' + token : ''}`, { share: true });

    return <>{children}</>;
}
