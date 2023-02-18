<script lang="ts">
	import { page } from '$app/stores';
	import Button from '$lib/components/Button/Button.svelte';
	import SelectedAlbum from '$lib/components/SelectedAlbum/SelectedAlbum.svelte';
	import { roomStore, websocketStore } from '$lib/stores/AppStore';
	import { RoomState, type Choice } from '../../../types/Room';
	import ContinueModal from './ContinueModal.svelte';
	import RoomSteps from './RoomSteps.svelte';
	import SearchModal from './SearchModal.svelte';
	import SpinnerModal from './SpinnerModal.svelte';
	import type { PageData } from './$types';
	import { goto } from '$app/navigation';
	import { browser } from '$app/environment';
	import NameModal from './NameModal.svelte';

	export let data: PageData;

	if (browser && !data.room) {
		goto('/');
	}

	let eliminating: Choice | undefined = undefined;

	websocketStore.subscribe((store) => {
		if (store.socket && store.connected && $roomStore?.id !== $page.params.room) {
			store.socket.emit('room:join', $page.params.room, (room) => {
				roomStore.set(room);
			});
		}

		if (store.socket && store.connected) {
			store.socket.on('room:album:eliminated', (id, choice) => {
				eliminating = choice;
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

	function onElimate() {
		if ($websocketStore.connected) {
			$websocketStore.socket?.emit('room:album:eliminate', $page.params.room, () => {
				console.log('here');
			});
		}
	}

	function onSpinnerComplete() {
		setTimeout(() => {
			roomStore.update((room) => {
				if (room && eliminating) {
					const choices = { ...room.choices };
					choices[eliminating.user].eliminated = true;
					return { ...room, choices };
				}

				return room;
			});
			eliminating = undefined;
		}, 1000);
	}

	$: winner = Object.values($roomStore?.choices ?? {}).find((c) => !c.eliminated);
	$: notWinners = Object.values($roomStore?.choices ?? {})
		.filter((c) => c.eliminated)
		.map((c) => ($roomStore?.users ?? []).find((u) => u.id === c.user));

    let nameModalOpen = (browser && !localStorage.getItem('name'));
</script>

<svelte:head>
    <title>sprintna.me - {data.room?.name}</title>
    <meta property="og:title" content={data.room?.name} />
    <meta property="og:type" content="website" />
    <meta property="og:url" content="https://sprintna.me/room/{data.room?.link_id}" />
    <meta property="og:site_name" content="sprintna.me" />
</svelte:head>

{#if $roomStore}
	<div class="flex">
		<a href="https://sprintna.me" class="flex-1 text-lg">sprintna.me</a>
		<h1 class="flex flex-1 justify-center text-3xl text-primary-content">{$roomStore.name}</h1>
		<div class="flex flex-1 justify-end text-lg">
            <Button on:click={() => nameModalOpen = true} block={false}>Change Name</Button>
        </div>
	</div>

	<div class="mt-14">
        <NameModal bind:open={nameModalOpen} />
		<RoomSteps />

		<div class="flex gap-x-16 gap-y-8 flex-wrap mt-16 justify-evenly items-stretch">
			{#if !eliminating}
				{#if $roomStore.state !== RoomState.FINISHED}
					{#each $roomStore.users as user}
						{#if $roomStore.choices[user.id]}
							<SelectedAlbum
								name={user.name}
								albumName={$roomStore.choices[user.id].choice.title}
								artistName={$roomStore.choices[user.id].choice.artist}
								albumImageUrl={$roomStore.choices[user.id].choice.imageUrl}
								albumLink={$roomStore.choices[user.id].choice.url}
								eliminated={$roomStore.choices[user.id].eliminated}
							/>
						{/if}
						{#if !$roomStore.choices[user.id]}
							<SelectedAlbum name={user.name} />
						{/if}
					{/each}
				{/if}
				{#if $roomStore.state === RoomState.FINISHED && winner}
					<SelectedAlbum
						name={$roomStore.users.find((u) => u.id == winner?.user)?.name ?? ''}
						albumName={winner.choice.title}
						artistName={winner.choice.artist}
						albumImageUrl={winner.choice.imageUrl}
						albumLink={winner.choice.url}
                        confetti
					/>
					<iframe
						class="shadow-lg"
						style="border-radius:12px"
						src={winner.choice.url.replace('/album/', '/embed/album/')}
						width="50%"
						height="380"
						frameborder="0"
						allowfullscreen
						allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
						title={winner.choice.title}
					/>
				{/if}
			{/if}
		</div>

		{#if $roomStore.state === RoomState.FINISHED && winner && notWinners && !eliminating}
			<div class="divider mt-16 mb-16">Not Winners</div>
			<div class="flex gap-x-16 gap-y-8 flex-wrap justify-evenly items-stretch">
				{#each notWinners as user}
					{#if user && $roomStore.choices[user.id]}
						<SelectedAlbum
							name={user.name}
							albumName={$roomStore.choices[user.id].choice.title}
							artistName={$roomStore.choices[user.id].choice.artist}
							albumImageUrl={$roomStore.choices[user.id].choice.imageUrl}
							albumLink={$roomStore.choices[user.id].choice.url}
							eliminated
						/>
					{/if}
					{#if user && !$roomStore.choices[user.id]}
						<SelectedAlbum name={user.name} />
					{/if}
				{/each}
			</div>
		{/if}

		<div class="mt-16 flex gap-x-8 justify-center">
			{#if $roomStore.state === RoomState.SELECTING}
				<SearchModal on:select={onAlbumSelected} />
				<ContinueModal on:continue={onContinue} />
			{/if}
			{#if $roomStore.state === RoomState.ELIMINATING}
				<Button on:click={onElimate} block={false} variant="warning"
					>Eliminate an album</Button
				>
			{/if}
		</div>
	</div>

	{#if eliminating}
		<SpinnerModal {eliminating} on:complete={onSpinnerComplete} />
	{/if}
{/if}
