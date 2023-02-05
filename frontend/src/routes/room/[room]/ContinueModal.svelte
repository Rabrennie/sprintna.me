<script lang="ts">
	import Button from '$lib/components/Button/Button.svelte';
	import Modal from '$lib/components/Modal/Modal.svelte';
	import { createEventDispatcher } from 'svelte';

	const dispatch = createEventDispatcher();

	let modal: Modal;

	function onContinue() {
		dispatch('continue');
		modal.toggle();
	}
</script>

<Modal id="continue-modal" buttonVariant="success" bind:this={modal}>
	<span slot="button">Continue</span>
	<span slot="modal">
		<h3 class="text-lg font-bold">Has everyone selected an album?</h3>
		<p class="py-4">Continuing will lock in everyones album choice</p>
		<div class="modal-action">
			<label for="continue-modal" class="btn">Cancel!</label>
			<Button variant="success" block={false} on:click={onContinue}>Continue</Button>
		</div>
	</span>
</Modal>
