<script lang="ts">
    import Confetti from '$lib/components/Confetti/Confetti.svelte';
    import { tick } from 'svelte';

    export let name: string;
    export let albumLink: string = 'https://open.spotify.com/album/5Z9iiGl2FcIfa3BMiv6OIw';
    export let albumName: string = 'Not Selected';
    export let artistName: string = 'Not Selected';
    export let albumImageUrl: string = 'https://sprintna.me//storage/no-album.png';
    export let eliminated: boolean = false;
    export let confetti: boolean = false;

    const emojis = ['❌', '👎', '🙅‍♀️', '⛔️', '🙅', '🙅‍♂️', '😭', '🚫', '💀'];
    const eliminatedEmoji = emojis[Math.floor(Math.random() * emojis.length)];

    function stringToHslColor(str: string, s: number, l: number) {
        var hash = 0;
        for (var i = 0; i < str.length; i++) {
            hash = str.charCodeAt(i) + ((hash << 5) - hash);
        }

        var h = hash % 360;
        return `hsl(${h}, ${s}%, ${l}%)`;
    }

    async function copy() {
        await navigator.clipboard.writeText(albumName);
    }
</script>

<div class="indicator">
    <div
        class="indicator-item indicator-top indicator-center badge text-primary-content"
        style="background-color: {stringToHslColor(name, 55, 60)}"
    >
        {name}
    </div>
    <div class="w-52 {eliminated ? 'opacity-50' : ''} group">
        {#if eliminated}
            <div class="absolute w-52 h-52 flex items-center justify-center">
                <div class="text-9xl select-none drop-shadow-[0_20px_20px_rgba(0,0,0,1)]">
                    {eliminatedEmoji}
                </div>
            </div>
        {/if}
        <a href={albumLink}>
            <Confetti fireOnLoad={confetti}>
                <div
                    class="bg-white bg-cover w-52 h-52 shadow-lg shadow-slate-900 mb-4 group-hover:scale-105 transition-transform album-image"
                    style="background-image: url({albumImageUrl})"
                />
            </Confetti>
        </a>

        <div class="text-primary-content flex items-center gap-x-2">
            <div>{albumName}</div>
            <button on:click={copy} class="opacity-0 group-hover:opacity-100 transition-opacity"
                ><svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke-width="1.5"
                    stroke="currentColor"
                    class="w-3 h-3"
                >
                    <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        d="M15.666 3.888A2.25 2.25 0 0013.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a.75.75 0 01-.75.75H9a.75.75 0 01-.75-.75v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 01-2.25 2.25H6.75A2.25 2.25 0 014.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 011.927-.184"
                    />
                </svg>
            </button>
        </div>
        <div class="text-base-content text-sm">{artistName}</div>
    </div>
</div>
