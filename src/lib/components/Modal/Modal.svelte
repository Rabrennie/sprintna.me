<script lang="ts">
    import { createEventDispatcher } from 'svelte';

    const dispatch = createEventDispatcher();

    export let id: string;
    export let isOpen: boolean = false;
    export let canClose: boolean = true;

    export function toggle() {
        isOpen = !isOpen;
    }

    export let buttonVariant: undefined | 'primary' | 'success' = undefined;

    let buttonVariantMap = {
        primary: 'btn-primary',
        success: 'btn-success'
    };

    $: isOpen ? dispatch('open') : dispatch('close');
</script>

{#if $$slots.button}
    <label for={id} class="btn {buttonVariant && buttonVariantMap[buttonVariant]}">
        <slot name="button" />
    </label>
{/if}
{#if $$slots.customButton}
    <slot name="customButton" {toggle} />
{/if}
<input type="checkbox" {id} class="modal-toggle" bind:checked={isOpen} />
<label for={canClose ? id : null} class="modal {canClose && 'cursor-pointer'}">
    <label class="modal-box relative" for="">
        <slot name="modal" {toggle} />
    </label>
</label>
