import { EventEmitter } from 'node:events';
import type { RoomEvent, RoomEvents } from './events';

export class SseClient {
    eventEmitter: EventEmitter;

    constructor() {
        this.eventEmitter = new EventEmitter();
    }

    send<T extends RoomEvent>(event: T, data: RoomEvents[T]) {
        console.log('send', event, data);
        this.eventEmitter.emit('send', event, data);
    }

    delaySend<T extends RoomEvent>(event: T, delay: number, data: RoomEvents[T]) {
        console.log('delaySend', event, data);
        this.eventEmitter.emit('delaySend', event, delay, data);
    }
}
