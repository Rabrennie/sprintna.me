<script lang="ts">
    export let name: string;
    export let albumLink: string = 'https://open.spotify.com/album/5Z9iiGl2FcIfa3BMiv6OIw';
    export let albumName: string = 'Not Selected';
    export let artistName: string = 'Not Selected';
    export let albumImageUrl: string = 'https://sprintna.me//storage/no-album.png';

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
    <div class="w-52">
        <a href={albumLink} class="group hover:underline">
            <div
                class="bg-white bg-cover w-52 h-52 shadow-lg shadow-slate-900 mb-4 group-hover:scale-105 transition-transform album-image"
                style="background-image: url({albumImageUrl})"
            />
            <div class="text-primary-content">{albumName}</div>
            <div class="text-base-content text-sm">{artistName}</div>
        </a>
    </div>
</div>
