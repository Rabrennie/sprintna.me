import { z } from 'zod';
import { zk } from 'zodkit';
import { type Authenticated, RequireAuth } from '@rabrennie/sveltekit-auth/helpers';
import type { PageServerLoad, RequestEvent } from './$types';
import { error, redirect } from '@sveltejs/kit';
import { db } from '$lib/server/database';
import type { Actions } from './$types';
import crypto from 'crypto';

const getTeamOrError = async (event: RequestEvent) => {
    const result = zk.parseRouteParamsSafe(event, {
        id: z.number({ coerce: true }).positive().min(1)
    });

    if (!result.success || !event.locals.user) {
        throw error(403, 'Unauthorized');
    }

    const team = await db.team.findFirst({
        where: { id: result.data.id, users: { some: { id: event.locals.user.id } } },
        include: {
            users: {
                select: {
                    name: true,
                    image: true,
                    id: true,
                    _count: {
                        select: {
                            choices: {
                                where: {
                                    eliminated: false,
                                    room: { step: 'finished', teamId: result.data.id }
                                }
                            }
                        }
                    }
                },
                orderBy: { createdAt: 'desc' }
            },
            rooms: { include: { choices: true }, orderBy: { createdAt: 'desc' } }
        }
    });

    if (!team) {
        throw error(403, 'Unauthorized');
    }

    return team;
};

const loadFunction: Authenticated<PageServerLoad> = async (event) => {
    const team = await getTeamOrError(event);

    const teams = await db.team.findMany({
        where: { users: { some: { id: event.locals.user.id } } }
    });

    return {
        team,
        teams
    };
};

export const load = RequireAuth(loadFunction);

export const actions = {
    createRoom: async (event) => {
        const result = await zk.parseFormDataSafe(event, {
            name: z.string().min(1, 'Room name is required'),
            type: z.enum(['albums', 'movies'])
        });

        if (!result.success) {
            return result.response;
        }

        const team = await getTeamOrError(event);

        const room = await db.room.create({
            data: {
                name: result.data.name,
                linkId: crypto.randomBytes(16).toString('base64url'),
                teamId: team.id,
                type: result.data.type
            }
        });

        throw redirect(303, `/room/${room.linkId}`);
    },

    deleteRoom: async (event) => {
        const result = await zk.parseFormDataSafe(event, {
            id: z.number({ coerce: true }).positive().min(1)
        });

        if (!result.success) {
            return result.response;
        }

        const team = await getTeamOrError(event);
        const room = await db.room.findFirst({
            where: { id: result.data.id, teamId: team.id }
        });

        if (!room) {
            throw error(403, 'Unauthorized');
        }

        await db.choice.deleteMany({ where: { roomId: room.id } });
        await db.room.delete({ where: { id: room.id } });

        throw redirect(303, `/team/${room.teamId}`);
    }
} satisfies Actions;
