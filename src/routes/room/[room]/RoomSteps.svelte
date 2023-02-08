<script lang="ts">
	import Steps from '$lib/components/Steps/Steps.svelte';
	import { StepState } from '$lib/components/Steps/StepState';

	import { roomStore } from '$lib/stores/AppStore';
	import { RoomState } from '../../../types/Room';
</script>

{#if $roomStore}
	<Steps
		steps={[
			{
				name: 'Select',
				state:
					$roomStore.state === RoomState.SELECTING
						? StepState.CURRENT
						: StepState.COMPLETED
			},
			{
				name: 'Eliminate',
				state:
					$roomStore.state === RoomState.ELIMINATING
						? StepState.CURRENT
						: $roomStore.state === RoomState.SELECTING
						? StepState.FUTURE
						: StepState.COMPLETED
			},
			{
				name: 'Winner',
				state:
					$roomStore.state === RoomState.FINISHED ? StepState.CURRENT : StepState.FUTURE
			}
		]}
	/>
{/if}
