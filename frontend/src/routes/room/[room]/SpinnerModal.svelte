<script lang="ts">
	import Modal from '$lib/components/Modal/Modal.svelte';
	import Spinner from '$lib/components/Spinner/Spinner.svelte';
	import { roomStore } from '$lib/stores/AppStore';
	import type { Choice } from '../../../../../common/Room';

	export let eliminating: Choice;
</script>

<Modal id="spinner-modal" open={true}>
	<div slot="modal" class="flex items-center justify-center">
		<Spinner
			items={Object.values($roomStore?.choices ?? {}).map((c) => c.choice.title)}
			target={Object.values($roomStore?.choices ?? {}).findIndex(
				(c) => c.user === eliminating.user
			)}
			on:complete
		/>
	</div>
</Modal>
