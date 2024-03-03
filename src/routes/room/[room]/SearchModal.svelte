<script lang="ts">
    import { enhance } from '$app/forms';
    import Modal from '$lib/components/Modal/Modal.svelte';
    import TextInput from '$lib/components/TextInput/TextInput.svelte';
    import { createForm } from '$lib/stores/FormStore';

    interface Result {
        id: string;
        name: string;
        subtitle: string;
        image: string;
    }

    let modal: Modal;
    let query = '';
    let results: Result[] = [];
    let searching = false;
    export let type: 'albums' | 'movies' = 'albums';

    async function search() {
        searching = true;
        const params = new URLSearchParams({ q: query, type });
        const response = await fetch(`/api/search?${params}`, {
            method: 'GET',
            headers: {
                'content-type': 'application/json'
            }
        });

        const rawResults = await response.json();

        if (type === 'albums') {
            results = rawResults.map((album) => ({
                id: album.id,
                name: album.name,
                subtitle: album.artists[0].name,
                image: album.images[0].url
            }));
        } else {
            results = rawResults.map((movie) => ({
                id: movie.imdbID,
                name: movie.Title,
                subtitle: movie.Year,
                image: movie.Poster
            }));
        }

        searching = false;
    }

    const form = createForm(() => {
        modal.toggle();
    });
</script>

<Modal id="search" bind:this={modal} buttonVariant="primary">
    <span slot="button">Select your {type.substr(0, type.length - 1)}</span>
    <div slot="modal">
        <form on:submit|preventDefault={() => search()}>
            <TextInput placeholder="Search" bind:value={query} disabled={searching} />
        </form>
        <div class="flex flex-col gap-y-3">
            {#if !results}
                <div class="p-3 mt-3">Press <kbd class="kbd kbd-sm">Enter</kbd> to search.</div>
            {/if}
            {#if results && results.length === 0}
                <div class="p-3 mt-3">No Results</div>
            {/if}
            {#if results && results.length > 0}
                <div class="mt-3">
                    {#each results as result}
                        <form method="POST" action="?/selectAlbum" use:enhance={form.onSubmit}>
                            <input type="hidden" name="id" value={result.id} />
                            <button
                                type="submit"
                                class="flex px-3 p-2 gap-x-4 hover:bg-slate-900 cursor-pointer items-center rounded select-none w-full text-left"
                            >
                                <div
                                    class="w-16 h-16 fill bg-contain bg-no-repeat bg-center flex-shrink-0 flex-grow-0"
                                    style="background-image: url({result.image})"
                                />
                                <div>
                                    <div class="text-primary-content">{result.name}</div>
                                    <div class="text-base-content text-sm">
                                        {result.subtitle}
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
