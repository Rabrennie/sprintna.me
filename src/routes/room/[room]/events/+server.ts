import { SseClient } from '$lib/room/SseClient.server';
import type { RequestHandler } from './$types';
import { rooms } from './state.server';
import type { RoomEvent } from '$lib/room/events';

export const GET = (async ({ params }) => {
    const sseClient = new SseClient();

    rooms.set(params.room, [...(rooms.get(params.room) ?? []), sseClient]);

    const stream = new ReadableStream({
        start(controller) {
            sseClient.eventEmitter.on('send', (event: RoomEvent, data) => {
                controller.enqueue(`event: ${event}\ndata:${JSON.stringify(data)}\n\n`);
            });

            sseClient.eventEmitter.on('delaySend', (event: RoomEvent, delay: number, data) => {
                setTimeout(
                    () => controller.enqueue(`event: ${event}\ndata:${JSON.stringify(data)}\n\n`),
                    delay
                );
            });
        },
        cancel() {
            const clients = rooms.get(params.room) ?? [];
            const index = clients.indexOf(sseClient);
            if (index >= 0) {
                clients.splice(index, 1);
            }
        }
    });

    return new Response(stream, {
        headers: {
            'Content-Type': 'text/event-stream',
            'Cache-Control': 'no-cache',
            Connection: 'keep-alive'
        }
    });
}) satisfies RequestHandler;
