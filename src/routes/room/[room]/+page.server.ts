import { db, rooms } from '$lib/server/database';
import { zk } from 'zodkit';
import type { Actions, PageServerLoad, RequestEvent } from './$types';
import { z } from 'zod';
import { error, fail, redirect } from '@sveltejs/kit';
import { roomsState } from './events/state.server';
import type Room from '../../../types/Room';
import { RoomState, type Choice as RoomChoice } from '../../../types/Room';
import { RequireAuth } from '@rabrennie/sveltekit-auth/helpers';
import type { Choice, User } from '@prisma/client';
import crypto from 'crypto';
import * as Spotify from '$lib/server/spotify';
import * as OMDb from '$lib/server/omdb';
import { getPlaiceholder } from 'plaiceholder';

const getLinkId = (event: RequestEvent) => {
    const { room: linkId } = zk.parseRouteParams(event, { room: z.string().min(1) });
    return linkId;
};

const mapChoice = (choice: Choice, type: 'albums' | 'movies'): RoomChoice => ({
    userId: choice.userId,
    eliminated: choice.eliminated,
    choice: {
        artist: choice.albumArtist,
        title: choice.albumName,
        imageUrl: choice.albumImage,
        url:
            type === 'albums'
                ? `https://open.spotify.com/album/${choice.albumId}`
                : `https://www.imdb.com/title/${choice.albumId}`,
        cssGradient: choice.cssGradient ?? ''
    }
});

export const load = (async (event) => {
    if (!event.locals.user?.id) {
        event.cookies.set('redirect', `/room/${getLinkId(event)}`, { path: '/', maxAge: 300 });
        throw redirect(302, '/auth/redirect/google');
    }

    const dbRoom = await rooms.findOrError(getLinkId(event), event.locals.user.id, {
        include: { choices: true, team: { include: { users: { orderBy: { createdAt: 'desc' } } } } }
    });

    const room: Room = {
        id: dbRoom.id,
        teamId: dbRoom.team.id,
        name: dbRoom.name,
        type: dbRoom.type,
        state: dbRoom.step as RoomState,
        users: dbRoom.team.users.map((u) => ({ id: u.id, name: u.name, image: u.image })),
        choices: Object.fromEntries(
            dbRoom.choices.map((c) => [c.userId, mapChoice(c, dbRoom.type)])
        )
    };

    return {
        room
    };
}) satisfies PageServerLoad;

export const actions = {
    selectAlbum: RequireAuth(async (event) => {
        if (!event.locals.user?.id) {
            throw error(403, 'nope');
        }

        const user: User = event.locals.user;

        const dbRoom = await rooms.findOrError(getLinkId(event), user.id);

        if (dbRoom.step !== RoomState.SELECTING) {
            return fail(400, { error: 'Room is not in selecting phase' });
        }

        const schema = z.object({
            id: z.string()
        });

        const result = await zk.parseFormDataSafe(event, schema);

        if (!result.success) {
            return result.response;
        }

        let albumId: string | undefined;
        let albumArtist: string | undefined;
        let albumImage: string | undefined;
        let albumName: string | undefined;
        let cssGradient: string | null = null;

        if (dbRoom.type === 'albums') {
            const token = await Spotify.getToken();
            const album = await Spotify.singleAlbum(result.data.id, token);
            const src = album?.images?.find((i) => i.width >= 300 && i.width <= 600)?.url;

            if (!album || !src) {
                return fail(400, { error: 'Album does not exist' });
            }

            albumId = album.id;
            albumArtist = album.artists[0].name;
            albumImage = src;
            albumName = album.name;
        } else if (dbRoom.type === 'movies') {
            const token = await OMDb.getToken();
            const movie = await OMDb.singleMovie(result.data.id, token);

            if (!movie || movie.Poster === 'N/A') {
                return fail(400, { error: 'Movie does not exist' });
            }

            albumId = movie.imdbID;
            albumArtist = movie.Year;
            albumImage = movie.Poster;
            albumName = movie.Title;
        }

        if (!albumId || !albumArtist || !albumImage || !albumName) {
            return fail(400, { error: 'Missing data' });
        }

        try {
            const buffer = await fetch(albumImage).then(async (res) =>
                Buffer.from(await res.arrayBuffer())
            );

            const { css } = await getPlaiceholder(buffer);

            cssGradient = css.backgroundImage;
        } catch (err) {
            return fail(400, { error: 'Something went wrong' });
        }

        const where = {
            roomId_userId: {
                roomId: dbRoom.id,
                userId: user.id
            }
        };

        const albumData = {
            albumId,
            albumArtist,
            albumImage,
            albumName,
            eliminated: false,
            cssGradient
        };

        const dbChoice = await db.choice.upsert({
            where,
            update: albumData,
            create: {
                ...where.roomId_userId,
                ...albumData
            }
        });

        roomsState.broadcast(dbRoom.linkId, 'room:choices:update', {
            choices: [mapChoice(dbChoice, dbRoom.type)]
        });
    }),
    nextStep: RequireAuth(async (event) => {
        if (!event.locals.user?.id) {
            throw error(403, 'nope');
        }

        const user: User = event.locals.user;

        let dbRoom = await rooms.findOrError(getLinkId(event), user.id);

        if (dbRoom.step !== RoomState.SELECTING) {
            return fail(400, { error: 'Room is not in selecting phase' });
        }

        dbRoom = await rooms.nextStep(dbRoom);

        roomsState.broadcast(dbRoom.linkId, 'room:state:update', {
            state: dbRoom.step as RoomState
        });
    }),
    eliminate: RequireAuth(async (event) => {
        if (!event.locals.user?.id) {
            throw error(403, 'nope');
        }

        const user: User = event.locals.user;

        const dbRoom = await rooms.findOrError(getLinkId(event), user.id, {
            include: { choices: { where: { eliminated: false } } }
        });

        if (dbRoom.step !== RoomState.ELIMINATING) {
            return fail(400, { error: 'Room is not in eliminating phase' });
        }

        if (dbRoom.choices.length >= 2) {
            const choice = dbRoom.choices[crypto.randomInt(dbRoom.choices.length)];

            const dbChoice = await db.choice.update({
                where: { id: choice.id },
                data: { eliminated: true }
            });

            roomsState.broadcast(dbRoom.linkId, 'room:album:eliminated', {
                userId: dbChoice.userId
            });
        }

        if (dbRoom.choices.length - 1 <= 1) {
            await rooms.nextStep(dbRoom);
        }
    })
} satisfies Actions;
