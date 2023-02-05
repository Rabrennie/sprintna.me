<script lang="ts">
	import Modal from '$lib/components/Modal/Modal.svelte';
	import TextInput from '$lib/components/TextInput/TextInput.svelte';
	import { createEventDispatcher } from 'svelte';

    let modal: Modal;
	let query: string = '';
	let albums: any[] | null = null;
	let searching = false;

	const dispatch = createEventDispatcher();

	async function search(q: string) {
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

	function selectAlbum(album: any) {
		dispatch('select', {
			artist: album.artists[0].name,
			url: album.external_urls.spotify,
			imageUrl: album.images[0].url,
			title: album.name
		});

        modal.toggle();
	}
</script>

<Modal id="search" bind:this={modal} buttonVariant="primary">
	<span slot="button">Select your album</span>
	<div slot="modal">
		<form on:submit|preventDefault={() => search(query)}>
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
						<!-- svelte-ignore a11y-click-events-have-key-events -->
						<div
							class="flex px-3 p-2 gap-x-4 hover:bg-slate-900 cursor-pointer items-center rounded select-none"
							on:click={() => selectAlbum(album)}
						>
							<div
								class="w-16 h-16 fill bg-contain bg-no-repeat bg-center flex-shrink-0 flex-grow-0"
								style="background-image: url({album.images[0].url})"
							/>
							<div>
								<div class="text-primary-content">{album.name}</div>
								<div class="text-base-content text-sm">{album.artists[0].name}</div>
							</div>
						</div>
					{/each}
				</div>
			{/if}
		</div>
	</div>
</Modal>
