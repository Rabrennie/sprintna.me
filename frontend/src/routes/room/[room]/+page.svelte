<script lang="ts">
	import { page } from '$app/stores';
	import SelectedAlbum from '$lib/components/SelectedAlbum/SelectedAlbum.svelte';
	import Steps from '$lib/components/Steps/Steps.svelte';
	import { StepState } from '$lib/components/Steps/StepState';
	import { roomStore, websocketStore } from '$lib/stores/AppStore';
	import { RoomState } from '../../../../../common/Room';
	import ContinueModal from './ContinueModal.svelte';
	import SearchModal from './SearchModal.svelte';

	websocketStore.subscribe((store) => {
		if (store.socket && store.connected && $roomStore?.id !== $page.params.room) {
			store.socket.emit('room:join', $page.params.room, (room) => {
				roomStore.set(room);
			});
		}
	});

	function onAlbumSelected(event: CustomEvent<any>) {
		if ($websocketStore.connected) {
			$websocketStore.socket?.emit(
				'room:album:select',
				$page.params.room,
				event.detail,
				() => {
					console.log('here');
				}
			);
		}
	}

	function onContinue() {
		if ($websocketStore.connected) {
			$websocketStore.socket?.emit('room:proceed', $page.params.room, () => {
				console.log('here');
			});
		}
	}
</script>

{#if $roomStore}
	<div class="flex">
		<a href="https://sprintna.me" class="flex-1 text-lg">sprintna.me</a>
		<h1 class="flex flex-1 justify-center text-3xl text-primary-content">{$roomStore.name}</h1>
		<div class="flex flex-1 justify-end text-lg" />
	</div>

	<div class="mt-14">
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
				{ name: 'Winner', state: StepState.FUTURE }
			]}
		/>

		<div class="flex gap-x-16 gap-y-8 flex-wrap mt-16 justify-evenly items-stretch">
			{#each $roomStore.users as user}
				{#if $roomStore.choices[user.id]}
					<SelectedAlbum
						name={user.name}
						albumName={$roomStore.choices[user.id].choice.title}
						artistName={$roomStore.choices[user.id].choice.artist}
						albumImageUrl={$roomStore.choices[user.id].choice.imageUrl}
						albumLink={$roomStore.choices[user.id].choice.url}
					/>
				{/if}
				{#if !$roomStore.choices[user.id]}
					<SelectedAlbum name={user.name} />
				{/if}
			{/each}
		</div>

		<div class="mt-16 flex gap-x-8 justify-center">
			{#if $roomStore.state === RoomState.SELECTING}
				<SearchModal on:select={onAlbumSelected} />
				<ContinueModal on:continue={onContinue} />
			{/if}
		</div>
	</div>
{/if}
