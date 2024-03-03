<script lang="ts">
    import { page } from '$app/stores';
    import Button from '$lib/components/Button/Button.svelte';
    import Leaderboard from '$lib/components/Leaderboard/Leaderboard.svelte';
    import SelectedAlbum from '$lib/components/SelectedAlbum/SelectedAlbum.svelte';
    import { RoomState } from '../../../types/Room';
    import type { PageData } from './$types';
    import CreateRoomModal from './CreateRoomModal.svelte';
    import DeleteRoomModal from './DeleteRoomModal.svelte';
    import InviteModal from './InviteModal.svelte';

    let createRoomModal: CreateRoomModal;
    let inviteModal: InviteModal;
    let deleteRoomModal: DeleteRoomModal;

    export let data: PageData;

    let leaderboardData: { name: string; image: string; count: number }[];
    let deletingRoomId: number | null = null;

    $: leaderboardData = data.team.users
        .map((u) => ({ image: u.image, name: u.name, count: u._count.choices }))
        .sort((a, b) => b.count - a.count);
</script>

<svelte:head>
    <title>sprintna.me - {$page.data.team.name}</title>
</svelte:head>

<div class="flex flex-col gap-16 pb-8">
    <div class="navbar mt-4 p-0">
        <div class="navbar-start">
            <div class="dropdown">
                <label tabindex="0" class="btn btn-ghost btn-circle">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        class="h-5 w-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        ><path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M4 6h16M4 12h16M4 18h7"
                        /></svg
                    >
                </label>
                <ul
                    tabindex="0"
                    class="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52"
                >
                    <li><button on:click={() => inviteModal.toggle()}>Invite Users</button></li>
                </ul>
            </div>
        </div>
        <div class="navbar-center">
            <div class="normal-case text-3xl text-yellow-300">{$page.data.team.name}</div>
        </div>
        <div class="navbar-end">
            <div class="avatar-group -space-x-6 overflow-visible hidden md:flex">
                {#each $page.data.team.users as user}
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

    <div>
        <h2 class="text-2xl text-slate-100">Leaderboard</h2>
        <div class="pt-8">
            {#if !leaderboardData || leaderboardData[0].count === 0}
                <div>There's no data 😢</div>
            {:else}
                <Leaderboard data={leaderboardData} />
            {/if}
        </div>
    </div>

    <div class="flex justify-between items-center">
        <div class="flex gap-4 items-center">
            <h2 class="text-2xl text-slate-100">Rooms</h2>
            <Button block={false} variant="ghost" on:click={() => createRoomModal.toggle()}
                >Create</Button
            >
        </div>
    </div>

    {#each data.team.rooms as room}
        <hr class="border-slate-700" />
        <div class="flex flex-col gap-8 pb-4">
            <div class="flex items-center gap-3">
                <a href={`/room/${room.linkId}`} class="hover:underline">
                    <h3 class="text-2xl text-slate-100">
                        {room.name}
                    </h3>
                </a>
                <div class="dropdown">
                    <label
                        tabindex="0"
                        class="flex items-center text-slate-500 cursor-pointer pt-1"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke-width="1.5"
                            stroke="currentColor"
                            class="w-6 h-6"
                        >
                            <path
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                d="M6.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM12.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM18.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z"
                            />
                        </svg>
                    </label>
                    <ul
                        tabindex="0"
                        class="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-52"
                    >
                        <li>
                            <button
                                class="text-error"
                                on:click={() => {
                                    deletingRoomId = room.id;
                                    deleteRoomModal.toggle();
                                }}>Delete room</button
                            >
                        </li>
                    </ul>
                </div>
            </div>
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {#each room.choices.filter((c) => room.step !== RoomState.FINISHED || !c.eliminated) as choice}
                    <SelectedAlbum
                        name={data.team.users.find((u) => u.id === choice.userId).name ?? ''}
                        title={choice.albumName}
                        url={room.type === 'albums'
                            ? `https://open.spotify.com/album/${choice.albumId}`
                            : `https://www.imdb.com/title/${choice.albumId}`}
                        subtitle={choice.albumArtist}
                        image={choice.albumImage}
                        cssGradient={choice.cssGradient}
                        avatar={data.team.users.find((u) => u.id === choice.userId).image ?? ''}
                        small={false}
                        winner={room.step === RoomState.FINISHED}
                        type={room.type}
                    />
                {/each}
                {#if room.step === RoomState.FINISHED}
                    <div class="flex flex-col gap-4">
                        {#each room.choices.filter((c) => room.step === RoomState.FINISHED && c.eliminated) as choice}
                            <SelectedAlbum
                                name={data.team.users.find((u) => u.id === choice.userId).name ??
                                    ''}
                                title={choice.albumName}
                                url={room.type === 'albums'
                                    ? `https://open.spotify.com/album/${choice.albumId}`
                                    : `https://www.imdb.com/title/${choice.albumId}`}
                                subtitle={choice.albumArtist}
                                image={choice.albumImage}
                                cssGradient={choice.cssGradient}
                                avatar={data.team.users.find((u) => u.id === choice.userId).image ??
                                    ''}
                                small={true}
                                type={room.type}
                            />
                        {/each}
                    </div>
                {/if}
                {#if room.choices.length === 0}
                    <div>No choices</div>
                {/if}
            </div>
        </div>
    {/each}

    <CreateRoomModal bind:this={createRoomModal} />
    <InviteModal
        bind:this={inviteModal}
        link={new URL(`/invite/${data.team.invite}`, $page.url.origin).toString()}
    />
    <DeleteRoomModal bind:this={deleteRoomModal} id={deletingRoomId} />
</div>
