<script lang="ts">
    import { enhance } from '$app/forms';
    import Button from '$lib/components/Button/Button.svelte';
    import Modal from '$lib/components/Modal/Modal.svelte';
    import TextInput from '$lib/components/TextInput/TextInput.svelte';
    import { createForm } from '$lib/stores/FormStore';

    const form = createForm();

    $: console.log($form);
</script>

<Modal
    id="create-room-modal"
    buttonVariant="success"
    canClose={!$form.loading}
    on:open={form.reset}
>
    <svelte:fragment slot="customButton" let:toggle>
        <Button on:click={toggle}>Create Room</Button>
    </svelte:fragment>
    <svelte:fragment slot="modal" let:toggle>
        <h3 class="text-lg font-bold">Create a new room!</h3>
        <form
            method="POST"
            action="?/createRoom"
            class="flex flex-col gap-y-2 pt-4"
            use:enhance={form.onSubmit}
        >
            <TextInput name="name" placeholder="Room Name" errors={$form.errors} />
            <div class="modal-action">
                <Button variant="ghost" block={false} on:click={toggle} disabled={$form.loading}>
                    Cancel
                </Button>
                <Button
                    variant="success"
                    block={false}
                    type="submit"
                    disabled={$form.loading}
                    loading={$form.loading}>Continue</Button
                >
            </div>
        </form>
    </svelte:fragment>
</Modal>
