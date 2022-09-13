import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useWebSocket from 'react-use-websocket';
import Card from '../components/Card/Card';
import useRoomStore from '../stores/RoomStore';
import useUserStore from '../stores/UserStore';

export default function Index(): JSX.Element {
    let { token, setToken } = useUserStore((state) => ({ token: state.token, setToken: state.setToken }));

    const { sendJsonMessage, lastJsonMessage } = useWebSocket(`ws://localhost:4321/${token ? '?token=' + token : ''}`, {
        share: true,
    });
    const navigate = useNavigate();

    const { roomName, setRoomName, setRoomId, setRoomUsers } = useRoomStore((state) => ({
        roomName: state.name,
        setRoomName: state.setName,
        setRoomId: state.setId,
        setRoomUsers: state.setUsers,
    }));

    useEffect(() => {
        console.log(lastJsonMessage);

        if ((lastJsonMessage as any)?.type === 'joined-room') {
            setRoomName((lastJsonMessage as any).data.name);
            setRoomId((lastJsonMessage as any).data.id);
            setRoomUsers((lastJsonMessage as any).data.users);
            navigate(`/room/${(lastJsonMessage as any).data.id}`);
        }

        if ((lastJsonMessage as any)?.type === 'set-token') {
            setToken((lastJsonMessage as any).data.token);
        }
    }, [lastJsonMessage, navigate, setRoomId, setRoomName, setRoomUsers, setToken]);

    const onCreateClicked = () => {
        sendJsonMessage({ type: 'create-room', data: { name: roomName } });
    };

    return (
        <div className="w-screen h-screen flex justify-center items-center">
            <Card className="w-96" title="Create a room!">
                <div className="form-control w-full max-w-xs ">
                    <input type="text" className="input input-bordered" placeholder="Your Name" />
                </div>
                <div className="form-control w-full max-w-xs ">
                    <input
                        type="text"
                        className="input input-bordered"
                        placeholder="Room Name"
                        value={roomName}
                        onChange={(e) => setRoomName(e.target.value)}
                    />
                </div>
                <button className="btn btn-block" type="button" onClick={onCreateClicked}>
                    Create
                </button>
            </Card>
        </div>
    );
}
