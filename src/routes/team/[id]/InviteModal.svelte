<script lang="ts">
    import { enhance } from '$app/forms';
    import Button from '$lib/components/Button/Button.svelte';
    import Modal from '$lib/components/Modal/Modal.svelte';
    import TextInput from '$lib/components/TextInput/TextInput.svelte';

    let modal: Modal;

    export function toggle() {
        modal.toggle();
    }

    async function copy() {
        await navigator.clipboard.writeText(link);
    }

    export let link: string;
</script>

<Modal id="invite-team-modal" buttonVariant="success" bind:this={modal}>
    <svelte:fragment slot="modal" let:toggle>
        <h3 class="text-lg font-bold mb-2">Share this link to invite!</h3>
        <TextInput value={link} disabled />
        <Button on:click={copy}>Copy</Button>
    </svelte:fragment>
</Modal>
