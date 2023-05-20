import { RequireAuth, type Authenticated } from '@rabrennie/sveltekit-auth/helpers';
import { db } from '$lib/server/database';
import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

const loadFunction: Authenticated<PageServerLoad> = async (event) => {
    if (!event.locals.user) {
        throw redirect(307, '/');
    }

    const team = await db.team.findFirst({
        where: { users: { some: { id: event.locals.user.id } } }
    });

    if (team) {
        throw redirect(307, `/team/${team.id}`);
    } else {
        throw redirect(307, '/team/create');
    }
};

export const load = RequireAuth(loadFunction);
