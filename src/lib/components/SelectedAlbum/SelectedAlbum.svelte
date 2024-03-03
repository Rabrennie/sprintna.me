<script lang="ts">
    import Intersect from '$lib/actions/Intersect';

    export let name: string;
    export let url = 'https://open.spotify.com/album/5Z9iiGl2FcIfa3BMiv6OIw';
    export let title = 'Not Selected';
    export let subtitle = 'Not Selected';
    export let image: string | null = null;
    export let cssGradient: string;
    export let avatar = '';
    export let small = false;
    export let winner = false;
    export let type: 'albums' | 'movies' = 'albums';

    let imageLoaded = false;

    async function copy() {
        await navigator.clipboard.writeText(title);
    }

    function loadImage() {
        const img = new Image();
        img.onload = () => (imageLoaded = true);
        img.src = image ?? '';
    }

    $: height = small ? 'h-[4.5rem]' : 'h-auto sm:h-40';
    $: width = 'auto';
    $: aspect = type === 'albums' ? 'aspect-square' : 'aspect-[2/3]';
</script>

<div
    class="{height.replace('h-auto', 'h-fit')} overflow-hidden flex rounded  {small
        ? 'items-center flex-row'
        : 'flex-col sm:flex-row'} shadow shadow-slate-900 relative group"
    use:Intersect={{ options: { once: true }, onIntersect: loadImage }}
>
    {#if cssGradient}
        <div
            class="z-0 bg-slate-300 bg-cover w-full h-full album-image blur-xl scale-150 bg-no-repeat shrink-0 absolute top-0 left-0 opacity-30"
            style={`background-image: ${cssGradient}; background-position: 0 0 ,0 33.33333333333333%,0 66.66666666666666%,0 100%; background-size: 100% 25%;`}
        />
    {/if}
    {#if cssGradient && !imageLoaded}
        <div
            class="z-10 bg-slate-900 bg-cover {width} {height} album-image blur-xl scale-125 bg-no-repeat shrink-0 {aspect}"
            style={`background-image: ${cssGradient}; background-position: 0 0 ,0 33.33333333333333%,0 66.66666666666666%,0 100%; background-size: 100% 25%;`}
        />
    {/if}
    {#if imageLoaded}
        <a href={url} target="_blank" rel="noreferrer" class="z-10">
            <div
                class="z-10 bg-cover {height} {width} album-image bg-no-repeat shrink-0 {aspect}"
                style={`background-image: url(${image});`}
            />
        </a>
    {/if}
    <div
        class="z-10 flex justify-between w-full items-center px-9 flex-shrink flex-grow overflow-hidden"
    >
        <div
            class="flex {small
                ? 'gap-4'
                : 'py-6 flex-col h-full sm:gap-0 gap-4'} w-full justify-between overflow-hidden"
        >
            <div class=" flex flex-shrink overflow-hidden flex-col">
                <div class="flex gap-2 flex-shrink overflow-hidden">
                    <a
                        href={url}
                        target="_blank"
                        rel="noreferrer"
                        class="text-white hover:underline truncate flex-shrink">{title}</a
                    >
                    <button
                        on:click={copy}
                        class="opacity-0 group-hover:opacity-100 transition-opacity"
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
                <div class="text-sm">{subtitle}</div>
            </div>
            <div class="text-white flex gap-4 items-center">
                <div class="avatar">
                    <div class="w-9 rounded-full">
                        <img src={avatar} alt={name} />
                    </div>
                </div>
                {#if !small}
                    <div class="text-sm">{name}</div>
                {/if}
            </div>
        </div>
        {#if winner}
            <div class="text-3xl pl-4">🏆</div>
        {/if}
    </div>
</div>
