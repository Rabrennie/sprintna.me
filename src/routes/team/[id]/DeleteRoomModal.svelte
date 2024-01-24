<script lang="ts">
    import { enhance } from '$app/forms';
    import Button from '$lib/components/Button/Button.svelte';
    import Modal from '$lib/components/Modal/Modal.svelte';
    import { createForm } from '$lib/stores/FormStore';

    let modal: Modal;
    export let id: number | null;

    const form = createForm(() => {
        modal.toggle();
    });

    export function toggle() {
        modal.toggle();
    }
</script>

<Modal
    id="delete-room-modal"
    buttonVariant="success"
    canClose={!$form.loading}
    on:open={form.reset}
    bind:this={modal}
>
    <svelte:fragment slot="modal" let:toggle>
        <h3 class="text-lg font-bold">Are you sure you want to delete this room?</h3>
        <p class="text-gray-400 mt-2">
            This action cannot be undone. All data associated with this room will be deleted.
        </p>
        <form
            method="POST"
            action="?/deleteRoom"
            class="flex flex-col gap-y-2"
            use:enhance={form.onSubmit}
        >
            <input type="hidden" name="id" value={id} />
            <div class="modal-action">
                <Button variant="ghost" block={false} on:click={toggle} disabled={$form.loading}>
                    Cancel
                </Button>
                <Button
                    variant="error"
                    block={false}
                    type="submit"
                    disabled={$form.loading}
                    loading={$form.loading}>Delete Room</Button
                >
            </div>
        </form>
    </svelte:fragment>
</Modal>
