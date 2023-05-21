<script lang="ts">
    import { page } from '$app/stores';
    import Button from '$lib/components/Button/Button.svelte';
    import SelectedAlbum from '$lib/components/SelectedAlbum/SelectedAlbum.svelte';
    import { RoomState, type Choice } from '../../../types/Room';
    import ContinueModal from './ContinueModal.svelte';
    import RoomSteps from './RoomSteps.svelte';
    import SearchModal from './SearchModal.svelte';
    import SpinnerModal from './SpinnerModal.svelte';
    import type { PageData } from './$types';
    import { browser } from '$app/environment';
    import { roomStore } from '$lib/stores/RoomStore';
    import { enhance } from '$app/forms';

    export let data: PageData;
    roomStore.set(data.room);

    let eliminating: Choice | undefined = undefined;

    async function subscribe() {
        const RoomEventSource = (await import('$lib/room/RoomEventSource')).default;
        // TODO: handle reconnecting
        const sse = new RoomEventSource(`${window.location.pathname}/events`);

        sse.addEventListener('room:users:update', (event) => {
            console.log('myevent', event);
        });

        sse.addEventListener('room:choices:update', roomStore.onChoicesUpdate);

        sse.addEventListener('room:state:update', roomStore.onStateUpdate);

        sse.addEventListener('room:album:eliminated', (data) => {
            eliminating = $roomStore?.choices[data.userId];
        });

        return () => sse.close();
    }

    if (browser) {
        subscribe();
    }

    function onSpinnerComplete() {
    	setTimeout(() => {
            if (!eliminating) {
                return;
            }

            roomStore.onEliminated({ userId: eliminating.userId });
            eliminating = undefined;
    	}, 1000);
    }

    $: winner = Object.values($roomStore?.choices ?? {}).find((c) => !c.eliminated);
    $: notWinners = Object.values($roomStore?.choices ?? {})
        .filter((c) => c.eliminated)
        .map((c) => ($roomStore?.users ?? []).find((u) => u.id === c.userId));
</script>

<svelte:head>
    <title>sprintna.me - {$page.data.room?.name}</title>
    <meta property="og:title" content={$page.data.room?.name} />
    <meta property="og:description" content="Say goodbye to uninspired sprint names" />
    <meta property="og:type" content="website" />
    <meta property="og:url" content="https://sprintna.me/room/{$page.data.room?.link_id}" />
    <meta property="og:site_name" content="sprintna.me" />
</svelte:head>

{#if $roomStore}
    <div class="flex">
        <a href="https://sprintna.me" class="flex-1 text-lg">sprintna.me</a>
        <h1 class="flex flex-1 justify-center text-3xl text-primary-content">{$roomStore.name}</h1>
        <div class="flex flex-1 justify-end text-lg">
            <div class="avatar-group -space-x-6">
                {#each $roomStore.users as user}
                    <div class="avatar">
                        <div class="w-12">
                            <img src={user.image} alt={user.name} />
                        </div>
                    </div>
                {/each}
            </div>
        </div>
    </div>

    <div class="mt-14">
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
                        name={$roomStore.users.find((u) => u.id == winner?.userId)?.name ?? ''}
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
                <SearchModal on:select={() => {}} />
                <ContinueModal />
            {/if}
            {#if $roomStore.state === RoomState.ELIMINATING}
                <form method="POST" action="?/eliminate" use:enhance>
                    <Button type="submit" block={false} variant="warning">Eliminate an album</Button
                    >
                </form>
            {/if}
        </div>
    </div>

    {#if eliminating}
        <SpinnerModal {eliminating} on:complete={onSpinnerComplete} />
    {/if}
{/if}
