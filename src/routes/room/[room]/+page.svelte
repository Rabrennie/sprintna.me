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
    import { roomStore } from '$lib/stores/RoomStore';
    import { enhance } from '$app/forms';
    import { invalidateAll } from '$app/navigation';
    import { onDestroy, onMount } from 'svelte';
    import ArrowLeftIcon from '$lib/components/Icons/ArrowLeftIcon.svelte';
    import { quintOut } from 'svelte/easing';
    import { crossfade } from 'svelte/transition';
    import { flip } from 'svelte/animate';
    import type User from '../../../types/User';
    import Confetti from '$lib/components/Confetti/Confetti.svelte';
    import type RoomEventSource from '$lib/room/RoomEventSource';
    import MovieInfo from './MovieInfo.svelte';

    const [send, receive] = crossfade({
        duration: 300,

        fallback(node) {
            const style = getComputedStyle(node);
            const transform = style.transform === 'none' ? '' : style.transform;

            return {
                duration: 150,
                easing: quintOut,
                css: (t) => `
                    transform: ${transform} scale(${t});
                    opacity: ${t}
                `
            };
        }
    });

    export let data: PageData;
    roomStore.set(data.room);

    let eliminating: Choice | undefined = undefined;
    let sse: RoomEventSource | undefined;

    async function subscribe() {
        const RoomEventSource = (await import('$lib/room/RoomEventSource')).default;
        sse = new RoomEventSource(`${window.location.pathname}/events`);

        sse.addEventListener('room:users:update', (event) => {
            console.log('myevent', event);
        });

        sse.addEventListener('room:choices:update', roomStore.onChoicesUpdate);

        sse.addEventListener('room:state:update', roomStore.onStateUpdate);

        sse.addEventListener('room:album:eliminated', (data) => {
            eliminating = $roomStore?.choices[data.userId];
        });

        sse.onerror = async (ev) => {
            console.log(ev);
            sse?.close();
            await invalidateAll();
            subscribe();
        };
    }

    onMount(subscribe);
    onDestroy(() => sse?.close());

    function onSpinnerComplete() {
        setTimeout(async () => {
            if (!eliminating) {
                return;
            }

            const userId = eliminating.userId;
            eliminating = undefined;

            setTimeout(() => {
                roomStore.onEliminated({ userId });
            }, 300);
        }, 1000);
    }

    $: winner = Object.values($roomStore?.choices ?? {}).find((c) => !c.eliminated);
    $: userChoices = Object.values($roomStore?.choices ?? {})
        .map((c) => ($roomStore?.users ?? []).find((u) => u.id === c.userId))
        .filter((u) => !!u) as User[];
    $: notWinners = Object.values($roomStore?.choices ?? {})
        .filter((c) => c.eliminated)
        .map((c) => ($roomStore?.users ?? []).find((u) => u.id === c.userId))
        .filter((u) => !!u) as User[];
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
    <div class="navbar mt-4 p-0">
        <div class="navbar-start">
            <a
                href="{$page.url.origin}/team/{$roomStore.teamId}"
                class="flex items-center gap-3 flex-1"
            >
                <ArrowLeftIcon class="w-8 h-8 sm:w-4 sm:h-4" />
                <div class="hidden sm:flex">Back to team</div>
            </a>
        </div>
        <div class="navbar-center">
            <div class="normal-case text-3xl text-yellow-300">{$roomStore.name}</div>
        </div>
        <div class="navbar-end">
            <div class="avatar-group -space-x-6 overflow-visible hidden md:flex">
                {#each userChoices as user}
                    <div class="tooltip" data-tip={user.name}>
                        <div class="avatar">
                            <div class="w-10">
                                <img
                                    src={user.image}
                                    alt={user.name}
                                    referrerpolicy="no-referrer"
                                />
                            </div>
                        </div>
                    </div>
                {/each}
            </div>
        </div>
    </div>

    <div class="mt-8">
        <RoomSteps />
        {#if userChoices.length === 0}
            <div class="text-center mt-16">
                Nobody has selected a{$roomStore.type === 'albums' ? 'n album' : ' movie'} yet 😢
            </div>
        {/if}
        {#if !eliminating}
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-16">
                {#each userChoices.filter((u) => $roomStore.state === RoomState.SELECTING || !$roomStore.choices[u.id]?.eliminated) as user (user.id)}
                    {@const choice = $roomStore.choices[user.id].choice}
                    <div
                        in:receive={{ key: user.id }}
                        out:send={{ key: user.id }}
                        animate:flip={{ duration: 300 }}
                    >
                        <Confetti fireOnLoad={$roomStore.state === RoomState.FINISHED}>
                            <SelectedAlbum
                                name={user.name}
                                title={choice.title}
                                subtitle={choice.artist}
                                image={choice.imageUrl}
                                url={choice.url}
                                cssGradient={choice.cssGradient}
                                avatar={user.image ?? ''}
                                winner={$roomStore.state === RoomState.FINISHED}
                                type={$roomStore.type}
                            />
                        </Confetti>
                    </div>
                {/each}
                {#if $roomStore.state === RoomState.FINISHED && winner && $roomStore.type === 'albums'}
                    <iframe
                        class="shadow-lg w-full"
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
                {#if $roomStore.state === RoomState.FINISHED && winner && $roomStore.type === 'movies'}
                    <MovieInfo movieId={winner.choice.url.split('/').pop()} gradient={winner.choice.cssGradient} />
                {/if}
            </div>

            {#if [RoomState.ELIMINATING, RoomState.FINISHED].includes($roomStore.state) && notWinners.length && !eliminating}
                <div class="divider mt-16 mb-16">Eliminated</div>
                <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {#each notWinners as user (user.id)}
                        {@const choice = $roomStore.choices[user.id].choice}
                        <div
                            in:receive={{ key: user.id }}
                            out:send={{ key: user.id }}
                            animate:flip={{ duration: 300 }}
                        >
                            <SelectedAlbum
                                name={user.name}
                                title={choice.title}
                                subtitle={choice.artist}
                                image={choice.imageUrl}
                                url={choice.url}
                                cssGradient={choice.cssGradient}
                                avatar={user.image ?? ''}
                                type={$roomStore.type}
                            />
                        </div>
                    {/each}
                </div>
            {/if}

            <div class="mt-16 flex gap-x-8 justify-center">
                {#if $roomStore.state === RoomState.SELECTING}
                    <SearchModal on:select={() => {}} type={$roomStore.type} />
                    {#if userChoices.length >= 2}
                        <ContinueModal />
                    {/if}
                {/if}
                {#if $roomStore.state === RoomState.ELIMINATING}
                    <form method="POST" action="?/eliminate" use:enhance>
                        <Button type="submit" block={false} variant="warning"
                            >Eliminate an {$roomStore.type === 'albums' ? 'album' : 'movie'}</Button
                        >
                    </form>
                {/if}
            </div>
        {/if}
    </div>

    {#if eliminating}
        <SpinnerModal {eliminating} on:complete={onSpinnerComplete} />
    {/if}
{/if}
