import type { Action } from 'svelte/action';

export interface IntersectParameters {
    options: IntersectionObserverInit,
    onIntersect: () => void;
}

export default ((node: HTMLElement, { options, onIntersect }: IntersectParameters) => {
    const settings = { once: false, ...options };
    const observer = new IntersectionObserver((entries) => {
        const entry = entries[0];
        const intersecting = entry.isIntersecting;
        if (intersecting) {
            onIntersect();
            if (settings.once) {
                observer.unobserve(node);
            }
        }
    }, settings);
    observer.observe(node);
    return {
        destroy() {
            observer.unobserve(node);
        }
    };
}) satisfies Action;
