import { SseClient } from '$lib/room/SseClient.server';
import type { RequestHandler } from './$types';
import { rooms } from './state.server';
import type { RoomEvent } from '$lib/room/events';

export const GET = (async ({ params }) => {
    const sseClient = new SseClient();

    rooms.set(params.room, { ...(rooms.get(params.room) ?? {}), [sseClient.id]: sseClient });

    const stream = new ReadableStream({
        start(controller) {
            sseClient.eventEmitter.on('send', (event: RoomEvent, data) => {
                try {
                    controller.enqueue(`event: ${event}\ndata:${JSON.stringify(data)}\n\n`);
                } catch {
                    this.cancel?.();
                }
            });

            sseClient.eventEmitter.on('delaySend', (event: RoomEvent, delay: number, data) => {
                try {
                    setTimeout(
                        () =>
                            controller.enqueue(`event: ${event}\ndata:${JSON.stringify(data)}\n\n`),
                        delay
                    );
                } catch {
                    this.cancel?.();
                }
            });

            sseClient.send('ping', Date.now());
        },
        cancel() {
            sseClient.close();
            const clients = rooms.get(params.room) ?? {};
            if (clients[sseClient.id]) {
                delete clients[sseClient.id];
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
