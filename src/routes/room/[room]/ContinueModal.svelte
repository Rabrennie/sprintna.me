<script lang="ts">
    import { enhance } from '$app/forms';
    import Button from '$lib/components/Button/Button.svelte';
    import Modal from '$lib/components/Modal/Modal.svelte';

    let modal: Modal;
</script>

<Modal id="continue-modal" buttonVariant="success" bind:this={modal}>
    <span slot="button">Continue</span>
    <span slot="modal">
        <h3 class="text-lg font-bold">Has everyone selected an album?</h3>
        <p class="py-4">Continuing will lock in everyones album choice</p>
        <form method="POST" action="?/nextStep" use:enhance>
            <div class="modal-action">
                <label for="continue-modal" class="btn">Cancel!</label>
                <Button variant="success" block={false} type="submit">Continue</Button>
            </div>
        </form>
    </span>
</Modal>
