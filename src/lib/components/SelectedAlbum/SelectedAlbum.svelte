<script lang="ts">
    import Confetti from '$lib/components/Confetti/Confetti.svelte';

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
</script>

<div class="indicator">
    <div
        class="indicator-item indicator-top indicator-center badge text-primary-content"
        style="background-color: {stringToHslColor(name, 55, 60)}"
    >
        {name}
    </div>
    <div class="w-52 {eliminated ? 'opacity-50' : ''}">
        <a href={albumLink} class="group hover:underline">
            {#if eliminated}
                <div class="absolute w-52 h-52 flex items-center justify-center">
                    <div class="text-9xl select-none drop-shadow-[0_20px_20px_rgba(0,0,0,1)]">
                        {eliminatedEmoji}
                    </div>
                </div>
            {/if}
            <Confetti fireOnLoad={confetti}>
                <div
                    class="bg-white bg-cover w-52 h-52 shadow-lg shadow-slate-900 mb-4 group-hover:scale-105 transition-transform album-image"
                    style="background-image: url({albumImageUrl})"
                />
            </Confetti>

            <div class="text-primary-content">{albumName}</div>
            <div class="text-base-content text-sm">{artistName}</div>
        </a>
    </div>
</div>
