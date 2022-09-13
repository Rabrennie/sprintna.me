import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import useWebSocket from 'react-use-websocket';
import useRoomStore from '../stores/RoomStore';
import useUserStore from '../stores/UserStore';

export default function Room() {
    let { id } = useParams();

    let { token } = useUserStore(state => ({token: state.token, setToken: state.setToken}));

    const { sendJsonMessage, lastJsonMessage } = useWebSocket(`ws://localhost:4321/${token ? '?token=' + token : ''}`, {share: true});

    const { roomName, setRoomName, setRoomId, roomUsers, setRoomUsers } = useRoomStore((state) => ({
        roomName: state.name,
        roomUsers: state.users,
        setRoomName: state.setName,
        setRoomId: state.setId,
        setRoomUsers: state.setUsers,
    }));

    useEffect(() => {
        console.log(lastJsonMessage);

        if ((lastJsonMessage as any)?.type === 'joined-room') {
            setRoomName((lastJsonMessage as any).data.name);
            setRoomUsers((lastJsonMessage as any).data.users);
        }
    }, [lastJsonMessage, setRoomName, setRoomUsers]);

    useEffect(() => {
        setRoomId(id || '');
        sendJsonMessage({ type: 'join-room', data: { id } });
    }, [sendJsonMessage, id, setRoomId]);

    const onCreateClicked = () => {
        sendJsonMessage({ type: 'set-name', data: { name: 'wowza' } });
    };

    return (
        <div onClick={onCreateClicked}>
            Room {id} | {roomName}
            <div>
                {roomUsers.map(u => <div key={u.id}>{u.id || 'Anonymous'}</div>)}
            </div>
        </div>
    );
}
