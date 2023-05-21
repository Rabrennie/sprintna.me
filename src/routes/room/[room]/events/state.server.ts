import type { SseClient } from '$lib/room/SseClient.server';
import type { RoomEvent, RoomEvents } from '$lib/room/events';

export const rooms = new Map<string, SseClient[]>();

export const roomsState = {
    rooms,
    broadcast<T extends RoomEvent>(roomId: string, event: T, data: RoomEvents[T]) {
        rooms.get(roomId)?.forEach((c) => c.send(event, data));
    }
};
