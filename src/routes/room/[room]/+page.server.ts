import { db } from '$lib/server/database';
import { zk } from 'zodkit';
import type { PageServerLoad } from './$types';
import { z } from 'zod';

export const load = (async ({ params }) => {
    const { room } = zk.parseRouteParams(params, { room: z.string().min(1) });

    return {
        room: await db.room.findFirst({ where: { linkId: room } })
    };
}) satisfies PageServerLoad;
