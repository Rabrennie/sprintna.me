<script lang="ts">
    import type { HTMLInputAttributes } from 'svelte/elements';
    interface $$Props extends HTMLInputAttributes {
        errors?: Record<string, unknown> | undefined;
    }

    export let value: $$Props['value'] = '';
    export let errors: $$Props['errors'] = {};

    $: currentError =
        $$restProps?.name && errors && errors[$$restProps?.name] ? errors[$$restProps.name] : null;
</script>

<div class="form-control w-full">
    <input
        bind:value
        type="text"
        {...{
            ...$$restProps,
            class: `${$$restProps?.class || ''} input input-bordered w-full ${
                currentError ? 'input-error' : ''
            }`
        }}
    />
    {#if currentError}
        <label class="label" for={$$restProps.name}>
            <span class="label-text-alt text-error">{currentError}</span>
        </label>
    {/if}
</div>
