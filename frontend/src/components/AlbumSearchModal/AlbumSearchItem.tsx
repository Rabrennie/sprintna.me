import React, { CSSProperties } from 'react';
import Album from '../../types/Album';

interface Props {
    album: Album;
    onSelected: (album: Album) => void,
}

export default function AlbumSearchItem({ album, onSelected }: Props & React.HTMLAttributes<HTMLDivElement>) {
    const imageStyle: CSSProperties = {
        backgroundImage: `url(${album.imageUrl})`,
    };

    return (
        <div className="flex px-3 p-2 gap-x-4 hover:bg-slate-900 cursor-pointer items-center rounded select-none" onClick={() => onSelected(album)}>
            <div
                className="w-16 h-16 fill bg-contain bg-no-repeat bg-center flex-shrink-0 flex-grow-0"
                style={imageStyle}
            ></div>
            <div>
                <div className="text-primary-content">{album.name}</div>
                <div className="text-base-content text-sm">{album.artist}</div>
            </div>
        </div>
    );
}
