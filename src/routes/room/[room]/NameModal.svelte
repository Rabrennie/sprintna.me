<script lang="ts">
	import { browser } from "$app/environment";
	import Button from "$lib/components/Button/Button.svelte";
	import Modal from "$lib/components/Modal/Modal.svelte";
	import TextInput from "$lib/components/TextInput/TextInput.svelte";
	import { websocketStore } from "$lib/stores/AppStore";

    let name = browser ? (localStorage.getItem('name') ?? '') : ''
    export let open: boolean = true;

    function updateName() {
        localStorage.setItem('name', name);
        $websocketStore.socket?.emit('client:set:name', name, () => {
            open = false;
        });
    }
</script>

<Modal id="name-modal" bind:isOpen={open}>
    <div slot="modal" class="flex flex-col gap-y-3">
        <TextInput bind:value={name} placeholder="Your name"/>
        <Button on:click={updateName}>Update</Button>
    </div>
</Modal>
