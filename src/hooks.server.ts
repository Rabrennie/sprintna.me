import { AuthHandler, type Profile } from '@rabrennie/sveltekit-auth';
import { GoogleProvider } from '@rabrennie/sveltekit-auth/providers';
import { JwtStrategy } from '@rabrennie/sveltekit-auth/session';
import { env } from '$env/dynamic/private';
import type { Handle, RequestEvent } from '@sveltejs/kit';
import { sequence } from '@sveltejs/kit/hooks';
import { db } from '$lib/server/database';

const { AUTH_SECRET, GOOGLE_ID, GOOGLE_SECRET } = env;

const saveUser = async (event: RequestEvent, profile: Profile) => {
    const update = {
        email: profile.email,
        name: profile.name as string,
        image: profile.image
    };
    const providerDetails = {
        provider: profile.provider,
        providerId: profile.providerId
    };
    const create = {};

    await db.user.upsert({
        where: {
            provider_providerId: providerDetails
        },
        update,
        create: {
            ...update,
            ...providerDetails,
            ...create
        }
    });
};

const authHandler = AuthHandler({
    providers: [
        new GoogleProvider({
            clientId: GOOGLE_ID,
            clientSecret: GOOGLE_SECRET
        })
    ],
    sessionStrategy: new JwtStrategy({ authKey: AUTH_SECRET, issuer: 'https://sprintna.me' }),
    hooks: { onLogin: saveUser },
    loginRedirectRoute: '/dashboard'
}) satisfies Handle;

const setUser = (async ({ event, resolve }) => {
    const session = await event.locals.auth.getSession();

    if (session) {
        const user = await db.user.findUnique({
            where: {
                provider_providerId: { provider: session.provider, providerId: session.providerId }
            }
        });
        event.locals.user = user ?? undefined;
    }

    return await resolve(event);
}) satisfies Handle;

export const handle = sequence(authHandler, setUser);
