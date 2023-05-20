import { db } from '$lib/server/database';
import { zk } from 'zodkit';
import type { PageServerLoad } from './$types';
import { z } from 'zod';
import { error, type Actions, redirect } from '@sveltejs/kit';
import { RequireAuth } from '@rabrennie/sveltekit-auth/helpers';

export const load = (async (event) => {
    const result = zk.parseRouteParamsSafe(event, { invite: z.string().min(1) });

    if (!result.success) {
        throw error(400, 'Invalid invite link');
    }

    const team = await db.team.findFirst({ where: { invite: result.data.invite } });

    if (!team) {
        throw error(400, 'Invalid invite link');
    }

    if (!event.locals.user) {
        event.cookies.set('invite', result.data.invite, { path: '/' });
    }

    return {
        invite: result.data.invite,
        name: team.name
    };
}) satisfies PageServerLoad;

export const actions = {
    default: RequireAuth(async (event) => {
        if (!event.locals.user) {
            throw redirect(303, '/');
        }

        const { invite } = await zk.parseFormData(event, { invite: z.string().min(1) });

        const team = await db.team.findFirst({ where: { invite } });

        if (!team) {
            throw error(400, 'Invalid invite link');
        }

        await db.team.update({
            where: { id: team.id },
            data: { users: { connect: { id: event.locals.user.id } } }
        });

        throw redirect(303, `/team/${team.id}`);
    })
} satisfies Actions;
