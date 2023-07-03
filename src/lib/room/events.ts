import { z } from 'zod';
import { RoomState } from '../../types/Room';

const usersUpdateSchema = z.object({
    users: z.object({ id: z.number({ coerce: true }), name: z.string() }).array()
});

const choicesUpdateSchema = z.object({
    choices: z
        .object({
            userId: z.number({ coerce: true }),
            choice: z.object({
                artist: z.string(),
                url: z.string(),
                imageUrl: z.string(),
                title: z.string(),
                cssGradient: z.string(),
            }),
            eliminated: z.boolean()
        })
        .array()
});

const stateUpdateSchema = z.object({
    state: z.nativeEnum(RoomState)
});

const albumEliminatedSchema = z.object({
    userId: z.number({ coerce: true })
});

export type RoomEvent =
    | 'room:users:update'
    | 'room:choices:update'
    | 'room:state:update'
    | 'room:album:eliminated'
    | 'ping';

export const RoomEventSchemas = {
    'room:users:update': usersUpdateSchema,
    'room:choices:update': choicesUpdateSchema,
    'room:state:update': stateUpdateSchema,
    'room:album:eliminated': albumEliminatedSchema,
    ping: z.number()
} satisfies {
    [key in RoomEvent]: z.ZodSchema;
};

export type RoomEvents = {
    [K in RoomEvent]: z.infer<(typeof RoomEventSchemas)[K]>;
};
