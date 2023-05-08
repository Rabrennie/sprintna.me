import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ locals }) => {
    return {
        session: { user: locals.user },
        auth: await locals.auth.getAuthPageData(),
    };
};
