import { RequireAuth, type Authenticated } from '@rabrennie/sveltekit-auth/helpers';
import { db } from '$lib/server/database';
import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

const loadFunction: Authenticated<PageServerLoad> = async (event) => {
    if (!event.locals.user) {
        throw redirect(303, '/');
    }

    const invite = event.cookies.get('invite');
    event.cookies.delete('invite', { path: '/' });

    const team = await db.team.findFirst({
        where: invite
            ? { invite }
            : {
                users: { some: { id: event.locals.user.id } }
            }
    });

    if (team && invite) {
        await db.team.update({
            where: { id: team.id },
            data: { users: { connect: { id: event.locals.user.id } } }
        });
    }

    if (team) {
        throw redirect(303, `/team/${team.id}`);
    } else {
        throw redirect(303, '/team/create');
    }
};

export const load = RequireAuth(loadFunction);
