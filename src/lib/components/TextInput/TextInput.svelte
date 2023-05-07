<script lang="ts">
    import type { HTMLInputAttributes } from 'svelte/elements';
    interface $$Props extends HTMLInputAttributes {}

    export let value: string = '';
</script>

<div class="form-control w-full">
    <input
        bind:value
        type="text"
        {...{
            ...$$restProps,
            class: `${$$restProps.class || ''} input input-bordered w-full`
        }}
    />
</div>
