import { z } from 'zod';
import { zk } from 'zodkit';
import { type Authenticated, RequireAuth } from '@rabrennie/sveltekit-auth/helpers';
import type { Actions, PageServerLoad } from './$types';
import { redirect } from '@sveltejs/kit';
import { db } from '$lib/server/database';

const loadFunction: Authenticated<PageServerLoad> = async ({ locals }) => {
    if (!locals.user) {
        throw redirect(300, '/');
    }
};

export const load = RequireAuth(loadFunction);

export const actions = {
    default: RequireAuth(async (event) => {
        if (!event.locals.user) {
            throw redirect(300, '/');
        }

        const result = await zk.parseFormDataSafe(event, {
            name: z.string().min(3, 'Must be more than 3 characters')
        });

        if (!result.success) {
            return result.response;
        }

        const team = await db.team.create({
            data: {
                name: result.data.name,
                users: { connect: [{ id: event.locals.user.id }] }
            }
        });

        throw redirect(302, `/team/${team.id}`);
    })
} satisfies Actions;
