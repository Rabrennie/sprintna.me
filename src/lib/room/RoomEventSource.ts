import { RoomEventSchemas, type RoomEvent, type RoomEvents } from './events';

export default class RoomEventSource extends EventSource {
    addEventListener<K extends RoomEvent>(
        type: K,
        listener: (this: RoomEventSource, ev: RoomEvents[K]) => unknown,
        options?: boolean | AddEventListenerOptions
    ) {
        const wrapper = ((event: MessageEvent) => {
            try {
                const data = RoomEventSchemas[type].parse(JSON.parse(event.data)) as RoomEvents[K];
                listener.call(this, data);
            } catch (error) {
                console.error(error);
                // TODO: something
            }
        }).bind(this);
        return super.addEventListener(type, wrapper, options);
    }
}
