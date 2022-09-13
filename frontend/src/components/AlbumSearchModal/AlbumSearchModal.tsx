import React, { useState, KeyboardEvent, useEffect } from 'react';
import useWebSocket from 'react-use-websocket';
import useUserStore from '../../stores/UserStore';
import Album from '../../types/Album';
import AlbumSearchItem from './AlbumSearchItem';

interface Props {
    onClose: () => void;
}

export default function AlbumSearchModal({ onClose }: Props) {
    let { token } = useUserStore((state) => ({ token: state.token, setToken: state.setToken }));

    const { sendJsonMessage, lastJsonMessage } = useWebSocket(`ws://localhost:4321/${token ? '?token=' + token : ''}`, {
        share: true,
    });

    const [hasSearched, setHasSearched] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [results, setResults] = useState([] as Album[]);

    useEffect(() => {
        console.log(lastJsonMessage);

        if ((lastJsonMessage as any)?.type === 'search-result') {
            setResults((lastJsonMessage as any).data.results);
            setIsLoading(false);
        }
    }, [lastJsonMessage, setResults, setIsLoading]);

    const handleKeyUp = (event: KeyboardEvent) => {
        if (event.code === 'Enter') {
            setIsLoading(true);
            setHasSearched(true);
            sendJsonMessage({ type: 'search-album', data: { query: (event.target as HTMLInputElement).value } });
        }
    };

    const onAlbumSelected = (album: Album) => {
        sendJsonMessage({ type: 'album-selected', data: { id: album.id } });
        onClose();
    };

    return (
        <div>
            <input type="checkbox" id="song-modal" className="modal-toggle" checked={true} readOnly />
            <label className="modal cursor-pointer" htmlFor="song-modal">
                <label className="modal-box relative" htmlFor="">
                    <div className="">
                        <input
                            type="text"
                            placeholder="Search"
                            className="input input-bordered w-full"
                            onKeyUp={handleKeyUp}
                        />
                    </div>
                    <div className="flex flex-col gap-y-3">
                        {isLoading && <button className="btn btn-ghost loading"></button>}
                        {!hasSearched && !isLoading && (
                            <div className="p-3 mt-3">
                                Press <kbd className="kbd kbd-sm">Enter</kbd> to search.
                            </div>
                        )}
                        {hasSearched && !isLoading && results.length === 0 && (
                            <div className="p-3 mt-3">No Results</div>
                        )}
                        {hasSearched && !isLoading && results.length > 0 && (
                            <div className="mt-3">
                                {results.map((r) => (
                                    <AlbumSearchItem
                                        album={r}
                                        key={r.id}
                                        onSelected={onAlbumSelected}
                                    ></AlbumSearchItem>
                                ))}
                            </div>
                        )}
                    </div>
                </label>
            </label>
        </div>
    );
}
