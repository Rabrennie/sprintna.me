import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import useWebSocket from 'react-use-websocket';
import AlbumSearchModal from '../components/AlbumSearchModal/AlbumSearchModal';
import AlbumSelection from '../components/AlbumSelection/AlbumSelection';
import useRoomStore from '../stores/RoomStore';
import useUserStore from '../stores/UserStore';

export default function Room() {
    let { id } = useParams();

    let { token } = useUserStore(state => ({token: state.token, setToken: state.setToken}));

    const { sendJsonMessage, lastJsonMessage } = useWebSocket(`ws://localhost:4321/${token ? '?token=' + token : ''}`, {share: true});

    const { roomName, setRoomName, setRoomId, roomUsers, setRoomUsers, addRoomUser, setRoomSelections, setRoomSelection, roomSelections} = useRoomStore((state) => ({
        roomName: state.name,
        roomUsers: state.users,
        roomSelections: state.selections,
        setRoomName: state.setName,
        setRoomId: state.setId,
        setRoomUsers: state.setUsers,
        addRoomUser: state.addRoomUser,
        setRoomSelections: state.setSelections,
        setRoomSelection: state.setSelection,
    }));

    const [showSearchModal, setShowSearchModal] = useState(false);

    useEffect(() => {
        console.log(lastJsonMessage);

        if ((lastJsonMessage as any)?.type === 'joined-room') {
            setRoomName((lastJsonMessage as any).data.name);
            setRoomUsers((lastJsonMessage as any).data.users);
            setRoomSelections((lastJsonMessage as any).data.selections);
        }

        if ((lastJsonMessage as any)?.type === 'user-joined') {
            addRoomUser((lastJsonMessage as any).data);
        }

        if ((lastJsonMessage as any)?.type === 'album-selected') {
            setRoomSelection((lastJsonMessage as any).data.user.id, (lastJsonMessage as any).data.album);
        }

    }, [lastJsonMessage, setRoomName, setRoomUsers, addRoomUser, setRoomSelections, setRoomSelection]);

    useEffect(() => {
        setRoomId(id || '');
        sendJsonMessage({ type: 'join-room', data: { id } });
    }, [sendJsonMessage, id, setRoomId]);

    // const onCreateClicked = () => {
    //     sendJsonMessage({ type: 'set-name', data: { name: 'wowza' } });
    // };

    return (
        <div>
            Room {id} | {roomName}
            {showSearchModal && <AlbumSearchModal onClose={() => setShowSearchModal(false)}></AlbumSearchModal>}
            <div className="flex gap-x-16 gap-y-8 flex-wrap mt-16 justify-evenly items-stretch">
                {roomUsers.map(user => (<AlbumSelection user={user} album={roomSelections[user.id] ?? undefined}></AlbumSelection>))}
            </div>
            <button className="btn" onClick={() => setShowSearchModal(true)}>select</button>
        </div>
    );
}
