import React, { CSSProperties } from 'react';
import Album from '../../types/Album';
import User from '../../types/User';

interface Props {
    user: User;
    album?: Album,
}

export default function AlbumSelection({ user, album }: Props) {
    const indicatorStyle: CSSProperties = {
        backgroundColor: stringToHslColor(user.name || 'Anonymous', 55, 60),
    };

    const imageStyle: CSSProperties = {
        backgroundImage: album ? `url(${album.imageUrl})` : undefined,
    };

    return (
        <div className="indicator">
            <span
                className="indicator-item indicator-top indicator-center badge text-primary-content"
                style={indicatorStyle}
            >
                {user.name || 'Anonymous'}
            </span>
            <div className="w-52">
                <a
                    href={album?.url || ''}
                    className="group hover:underline"
                    target="_blank"
                    rel="noreferrer"
                >
                    <div
                        className="bg-base-100 bg-cover w-52 h-52 shadow-lg shadow-slate-900 mb-4 group-hover:scale-105 transition-transform album-image"
                        style={imageStyle}
                    ></div>
                    <div className="text-primary-content">{album?.name || 'Not Selected'}</div>
                    <div className="text-base-content text-sm">{album?.artist || 'Not Selected'}</div>
                </a>
            </div>
        </div>
    );
}

function stringToHslColor(str: string, saturation: number, lightness: number): string {
    var hash = 0;
    for (var i = 0; i < str.length; i++) {
        hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }

    var h = hash % 360;
    return 'hsl(' + h + ', ' + saturation + '%, ' + lightness + '%)';
}
