<script lang="ts">
    import { page } from '$app/stores';
    import Button from '$lib/components/Button/Button.svelte';
    import Leaderboard from '$lib/components/Leaderboard/Leaderboard.svelte';
    import SelectedAlbum from '$lib/components/SelectedAlbum/SelectedAlbum.svelte';
    import { RoomState } from '../../../types/Room';
    import type { PageData } from './$types';
    import CreateRoomModal from './CreateRoomModal.svelte';
    import InviteModal from './InviteModal.svelte';

    let createRoomModal: CreateRoomModal;
    let inviteModal: InviteModal;

    export let data: PageData;

    let leaderboardData: { name: string; image: string; count: number }[];

    $: leaderboardData = data.team.users
        .map((u) => ({ image: u.image, name: u.name, count: u._count.choices }))
        .sort((a, b) => b.count - a.count);
</script>

<svelte:head>
    <title>sprintna.me - {data.team.name}</title>
</svelte:head>

<div class="flex flex-col gap-8 py-8">
    <div class="flex justify-between items-center">
        <div class="flex gap-4 items-center">
            <h1 class="text-4xl text-yellow-300">{$page.data.team.name}</h1>
            <Button block={false} variant="ghost" on:click={() => inviteModal.toggle()}
                >Invite</Button
            >
        </div>
        <div>
            <div class="avatar-group -space-x-6 overflow-visible">
                {#each $page.data.team.users as user}
                    <div class="tooltip" data-tip={user.name}>
                        <div class="avatar">
                            <div class="w-12">
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
        <a href={`/room/${room.linkId}`}>
            <div class="divider text-xl mt-8">
                <div class="tooltip capitalize" data-tip={room.step}>
                    <div
                        class="badge badge-xs capitalize mr-2 {room.step === RoomState.FINISHED
                            ? 'badge-success'
                            : ''} {room.step === RoomState.ELIMINATING
                            ? 'badge-warning'
                            : ''} {room.step === RoomState.SELECTING ? 'badge-primary' : ''}"
                    />
                    <span class="normal-case">{room.name}</span>
                </div>
            </div>
        </a>
        <div class="flex gap-x-16 gap-y-8 flex-wrap justify-evenly items-stretch">
            {#each room.choices.sort((a, b) => a.eliminated - b.eliminated) as choice}
                <SelectedAlbum
                    name={data.team.users.find((u) => u.id === choice.userId).name ?? ''}
                    albumName={choice.albumName}
                    albumLink={`https://open.spotify.com/album/${choice.albumId}`}
                    artistName={choice.albumArtist}
                    albumImageUrl={choice.albumImage}
                    eliminated={choice.eliminated}
                />
            {/each}
            {#if room.choices.length === 0}
                <div>No choices</div>
            {/if}
        </div>
    {/each}

    <CreateRoomModal bind:this={createRoomModal} />
    <InviteModal
        bind:this={inviteModal}
        link={new URL(`/invite/${data.team.invite}`, $page.url.origin).toString()}
    />
</div>
