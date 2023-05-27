import type { SubmitFunction } from '$app/forms';
import { writable } from 'svelte/store';

interface FormData {
    loading: boolean;
    errors?: Record<string, unknown>;
    data?: Record<string, unknown>;
}

export function createForm(afterSubmit?: () => void) {
    const initialState = (): FormData => ({
        loading: false,
        errors: undefined,
        data: undefined
    });

    const { subscribe, update, set } = writable<FormData>(initialState());

    const toggleLoading = (loading?: boolean) => {
        update((store) => {
            store.loading = loading === undefined ? !store.loading : loading;
            return store;
        });
    };

    const reset = () => set(initialState());

    const onSubmit: SubmitFunction = () => {
        reset();
        toggleLoading(true);
        afterSubmit?.();

        return async ({ update: formUpdate, result }) => {
            if (result.type == 'failure') {
                update((store) => {
                    store.errors = result.data?.errors;
                    return store;
                });
            }

            toggleLoading(false);
            await formUpdate();
        };
    };

    return {
        subscribe,
        onSubmit,
        reset
    };
}
