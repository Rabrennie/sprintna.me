<script lang="ts">
    import { enhance } from '$app/forms';
    import Modal from '$lib/components/Modal/Modal.svelte';
    import TextInput from '$lib/components/TextInput/TextInput.svelte';
    import { createForm } from '$lib/stores/FormStore';

    let modal: Modal;
    let query: string = '';
    let albums: SpotifyApi.AlbumSearchResponse['albums']['items'] | null = null;
    let searching = false;

    async function search() {
        searching = true;
        const params = new URLSearchParams({ q: query });
        const response = await fetch(`/api/search?${params}`, {
            method: 'GET',
            headers: {
                'content-type': 'application/json'
            }
        });

        albums = await response.json();

        searching = false;
    }

    const form = createForm(() => {
        modal.toggle();
    });
</script>

<Modal id="search" bind:this={modal} buttonVariant="primary">
    <span slot="button">Select your album</span>
    <div slot="modal">
        <form on:submit|preventDefault={() => search()}>
            <TextInput placeholder="Search" bind:value={query} disabled={searching} />
        </form>
        <div class="flex flex-col gap-y-3">
            {#if !albums}
                <div class="p-3 mt-3">Press <kbd class="kbd kbd-sm">Enter</kbd> to search.</div>
            {/if}
            {#if albums && albums.length === 0}
                <div class="p-3 mt-3">No Results</div>
            {/if}
            {#if albums && albums.length > 0}
                <div class="mt-3">
                    {#each albums as album}
                        <form method="POST" action="?/selectAlbum" use:enhance={form.onSubmit}>
                            <input type="hidden" name="albumArtist" value={album.artists[0].name} />
                            <input type="hidden" name="url" value={album.external_urls.spotify} />
                            <input type="hidden" name="albumImage" value={album.images[0].url} />
                            <input type="hidden" name="albumName" value={album.name} />
                            <button
                                type="submit"
                                class="flex px-3 p-2 gap-x-4 hover:bg-slate-900 cursor-pointer items-center rounded select-none w-full text-left"
                            >
                                <div
                                    class="w-16 h-16 fill bg-contain bg-no-repeat bg-center flex-shrink-0 flex-grow-0"
                                    style="background-image: url({album.images[0].url})"
                                />
                                <div>
                                    <div class="text-primary-content">{album.name}</div>
                                    <div class="text-base-content text-sm">
                                        {album.artists[0].name}
                                    </div>
                                </div>
                            </button>
                        </form>
                    {/each}
                </div>
            {/if}
        </div>
    </div>
</Modal>
