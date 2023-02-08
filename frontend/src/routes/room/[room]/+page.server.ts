import {db} from '$lib/server/database';
import type { PageServerLoad } from './$types';

export const load = (async ({ params }) => {
  return {
    room: await db.rooms.findFirst({ where: { link_id: params.room } })
  };
}) satisfies PageServerLoad;
