<script lang="ts">
    import type { HTMLButtonAttributes } from 'svelte/elements';

    export let variant: undefined | 'primary' | 'success' | 'warning' = undefined;
    export let block: boolean = true;

    interface $$Props extends HTMLButtonAttributes {
        variant?: 'primary' | 'success' | 'warning';
        block?: boolean;
    }

    let variantMap = {
        primary: 'btn-primary',
        success: 'btn-success',
        warning: 'btn-warning'
    };
</script>

<button
    on:click
    {...{
        ...$$restProps,
        class: `${$$restProps.class || ''} btn ${block ? 'btn-block' : ''} ${
            variant ? variantMap[variant] : ''
        }`,
        type: $$restProps.type ? $$restProps.type : 'button'
    }}><slot /></button
>
