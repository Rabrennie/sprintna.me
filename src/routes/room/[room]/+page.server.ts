import { db, rooms } from '$lib/server/database';
import { zk } from 'zodkit';
import type { Actions, PageServerLoad, RequestEvent } from './$types';
import { z } from 'zod';
import { error, fail } from '@sveltejs/kit';
import { roomsState } from './events/state.server';
import type Room from '../../../types/Room';
import { RoomState, type Choice as RoomChoice } from '../../../types/Room';
import { RequireAuth } from '@rabrennie/sveltekit-auth/helpers';
import type { Choice, User } from '@prisma/client';
import crypto from 'crypto';

const getLinkId = (event: RequestEvent) => {
    const { room: linkId } = zk.parseRouteParams(event, { room: z.string().min(1) });
    return linkId;
};

const mapChoice = (choice: Choice): RoomChoice => ({
    userId: choice.userId,
    eliminated: choice.eliminated,
    choice: {
        artist: choice.albumArtist,
        title: choice.albumName,
        imageUrl: choice.albumImage,
        url: `https://open.spotify.com/album/${choice.albumId}`
    }
});

export const load = (async (event) => {
    if (!event.locals.user?.id) {
        throw error(403, 'nope');
    }

    const dbRoom = await rooms.findOrError(getLinkId(event), event.locals.user.id, {
        include: { choices: true, team: { include: { users: { orderBy: { createdAt: 'desc' } } } } }
    });

    const room: Room = {
        id: dbRoom.id,
        teamId: dbRoom.team.id,
        name: dbRoom.name,
        state: dbRoom.step as RoomState,
        users: dbRoom.team.users.map((u) => ({ id: u.id, name: u.name, image: u.image })),
        choices: Object.fromEntries(dbRoom.choices.map((c) => [c.userId, mapChoice(c)]))
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

        // TODO: change this to just pass the ID and fetch the details from spotify api
        const schema = z
            .object({
                albumArtist: z.string(),
                url: z.string(),
                albumImage: z.string(),
                albumName: z.string()
            })
            .transform((val) => ({
                ...val,
                url: undefined,
                albumId: val.url.split('/')[val.url.split('/').length - 1],
                eliminated: false
            }));

        const result = await zk.parseFormDataSafe(event, schema);

        if (!result.success) {
            return result.response;
        }

        const where = {
            roomId_userId: {
                roomId: dbRoom.id,
                userId: user.id
            }
        };

        const dbChoice = await db.choice.upsert({
            where,
            update: result.data,
            create: {
                ...where.roomId_userId,
                ...result.data
            }
        });

        roomsState.broadcast(dbRoom.linkId, 'room:choices:update', {
            choices: [mapChoice(dbChoice)]
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
