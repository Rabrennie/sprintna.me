<script lang="ts">
    import type { HTMLButtonAttributes } from 'svelte/elements';

    export let variant: $$Props['variant'] = undefined;
    export let block: $$Props['block'] = true;
    export let loading: $$Props['block'] = false;

    const variantMap = {
        primary: 'btn-primary',
        success: 'btn-success',
        warning: 'btn-warning',
        ghost: 'btn-ghost'
    };

    interface $$Props extends HTMLButtonAttributes {
        variant?: keyof typeof variantMap;
        block?: boolean;
        loading?: boolean;
    }
</script>

<button
    on:click
    {...{
        ...$$restProps,
        class: `${$$restProps.class || ''} btn ${block ? 'btn-block' : ''} ${
            variant ? variantMap[variant] : ''
        } ${loading ? 'loading' : ''}`,
        type: $$restProps.type ? $$restProps.type : 'button'
    }}><slot /></button
>
