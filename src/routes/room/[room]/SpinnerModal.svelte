<script lang="ts">
    import Modal from '$lib/components/Modal/Modal.svelte';
    import Spinner from '$lib/components/Spinner/Spinner.svelte';
    import { roomStore } from '$lib/stores/AppStore';
    import type { Choice } from '../../../types/Room';

    export let eliminating: Choice;

    $: choices = Object.values($roomStore?.choices ?? {}).filter((c) => !c.eliminated);
</script>

<Modal id="spinner-modal" isOpen={true} canClose={false}>
    <div slot="modal" class="flex items-center justify-center">
        <Spinner
            items={choices.map((c) => c.choice.imageUrl)}
            target={choices.findIndex((c) => c.user === eliminating.user)}
            on:complete
        />
    </div>
</Modal>
