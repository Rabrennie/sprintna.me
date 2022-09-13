import React, { ReactNode } from 'react';

interface Props {
    title?: string;
    children?: ReactNode;
}

export default function Card({ title, children, className }: Props & React.HTMLAttributes<HTMLDivElement>) {
    return (
        <div className={`card bg-base-100 shadow-xl ${className}`}>
            <div className="card-body flex flex-col gap-y-3">
                {title && <h2 className="card-title">{title}</h2>}
                {children}
            </div>
        </div>
    );
}
