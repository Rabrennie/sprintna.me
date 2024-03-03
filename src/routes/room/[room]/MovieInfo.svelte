<script lang="ts">
    import { onMount } from 'svelte';

    export let movieId: string;
    export let gradient: string;

    let movieInfo = {};
    let movieLoaded = false;

    function getMovieInfo() {
        fetch(`/api/movie?id=${movieId}`)
            .then((res) => res.json())
            .then((data) => {
                movieInfo = data;
                movieLoaded = true;
            });
    }

    onMount(() => {
        getMovieInfo();
    });
</script>

<div class="shadlow-lg w-full max-h-[380px] overflow-hidden rounded-lg p-6 relative">
    <div
        class="z-0 bg-slate-300 bg-cover w-full h-full album-image blur-xl scale-150 bg-no-repeat shrink-0 absolute top-0 left-0 opacity-30"
        style={`background-image: ${gradient}; background-position: 0 0 ,0 33.33333333333333%,0 66.66666666666666%,0 100%; background-size: 100% 25%;`}
    />
    {#if movieLoaded}
        <div class="flex gap-8 mb-6 items-center">
            <img src={movieInfo.Poster} alt={movieInfo.Title} class="h-52 rounded-sm shadow-lg" />
            <div class="flex flex-col gap-4">
                <h1 class="text-3xl font-bold text-slate-50">{movieInfo.Title}</h1>
                <div class="flex flex-col">
                    <p class="uppercase text-xs text-slate-300">Genre</p>
                    <p class="text-slate-50">{movieInfo.Genre}</p>
                </div>
                <div class="flex flex-col">
                    <p class="uppercase text-xs text-slate-300">Cast</p>
                    <p class="text-slate-50">{movieInfo.Actors}</p>
                </div>
                <div class="flex flex-col">
                    <p class="uppercase text-xs text-slate-300">Director</p>
                    <p class="text-slate-50">{movieInfo.Director}</p>
                </div>
            </div>
        </div>
        <p class="text-slate-300 mt-6 border-t pt-4 border-slate-500">{movieInfo.Plot}</p>
    {/if}
</div>
