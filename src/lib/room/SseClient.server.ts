import { EventEmitter } from 'node:events';
import type { RoomEvent, RoomEvents } from './events';
import crypto from 'crypto';

export class SseClient {
    eventEmitter: EventEmitter;
    id: string;
    interval: NodeJS.Timer;

    constructor() {
        this.eventEmitter = new EventEmitter();
        this.id = crypto.randomBytes(16).toString('base64url');
        this.interval = setInterval(() => {
            this.send('ping', Date.now());
        }, 10000);
    }

    send<T extends RoomEvent>(event: T, data: RoomEvents[T]) {
        console.log(this.id, 'send', event, data);
        this.eventEmitter.emit('send', event, data);
    }

    delaySend<T extends RoomEvent>(event: T, delay: number, data: RoomEvents[T]) {
        console.log('delaySend', event, data);
        this.eventEmitter.emit(this.id, 'delaySend', event, delay, data);
    }

    close() {
        clearInterval(this.interval);
    }
}
