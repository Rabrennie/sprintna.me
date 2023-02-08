<script lang="ts">
	import { browser } from '$app/environment';
	import { goto } from '$app/navigation';
	import Button from '$lib/components/Button/Button.svelte';
	import Card from '$lib/components/Card/Card.svelte';
	import TextInput from '$lib/components/TextInput/TextInput.svelte';
    import { roomStore, websocketStore } from '$lib/stores/AppStore';
    let name = browser ? (localStorage.getItem('name') ?? '') : '';
    let roomName = '';

    function createRoom() {
        localStorage.setItem('name', name);
        $websocketStore.socket?.emit('client:set:name', name, () => {
            $websocketStore.socket?.emit('room:create', roomName, (room) => {
                console.log(room);
                roomStore.set(room);
                goto(`/room/${room.id}`);
            });
        });
    }
</script>

<svelte:head>
    <title>sprintna.me</title>
</svelte:head>

<div class="flex justify-center">
    <h1 class="absolute top-0 p-10 text-4xl text-primary-content">sprintna.me</h1>
    <div class="w-screen h-screen flex items-center justify-center">
        <Card title="Create a Room!" class="w-96">
            <TextInput bind:value={name} placeholder="Your Name"/>
            <TextInput bind:value={roomName} placeholder="Room Name"/>
            <Button on:click={createRoom}>Create</Button>
        </Card>
    </div>
</div>
