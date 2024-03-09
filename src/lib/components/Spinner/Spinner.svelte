<script lang="ts">
    import { browser } from '$app/environment';
    import { createEventDispatcher, onMount } from 'svelte';

    let spin = () => {};
    onMount(async () => {
        const anime = await import('animejs/lib/anime.js');
        spin = () => {
            if (browser && myEl && items.length) {
                anime.default({
                    targets: myEl,
                    rotate:
                        1080 -
                        (a1 * target) / tau +
                        (Math.random() * ((1 / items.length) * 360) -
                            ((1 / items.length) * 360) / 2) +
                        'deg',
                    duration: 10000,
                    easing: 'cubicBezier(0.265, -0.270, 0.020, 1.000)',
                    delay: 1000,
                    complete: () => dispatch('complete')
                });
            }
        };
    });

    export let items: string[] = [];
    export let target: number = 0;
    export let type: 'albums' | 'movies' = 'albums';

    let myEl: HTMLDivElement;

    const dispatch = createEventDispatcher();

    $: browser && myEl && spin();
    const tau = Math.PI / 180;
    $: a1 = (360 / items.length) * tau;
    $: positions = items.map((_, i) => {
        return [
            { x: 250 * Math.sin(0) + 250, y: 250 * Math.cos(0) + 250 },
            { x: 250 * Math.sin(a1) + 250, y: 250 * Math.cos(a1) + 250 }
        ];
    });
</script>

<div
    class="relative overflow-hidden"
    style="min-width: 500px; min-height: 500px; max-height: 500px; max-width: 500px;"
>
    <div
        class="relative p-16"
        style="min-width: 500px; min-height: 500px; max-height: 500px; max-width: 500px;"
        bind:this={myEl}
    >
        {#each items as item, i}
            <svg
                style="min-width: 500px; min-height: 500px; max-height: 500px; max-width: 500px; position: absolute; top:0; left: 0; transform: rotate({a1 *
                    i -
                    90 * tau +
                    a1 / 2}rad);"
                viewBox="0 0 500 500"
                xmlns="http://www.w3.org/2000/svg"
            >
                <image
                    href={item}
                    height={500}
                    width={type === 'albums' ? 500 : 750}
                    x={0}
                    y={0}
                    transform=""
                    clip-path="url(#clip{i})"
                    style="
                filter: blur(20px);"
                />
                <image
                    href={item}
                    height={type === 'albums' ? 250 : 400}
                    width={type === 'albums' ? 250 : 400}
                    x={type === 'albums' ? 250 : 175}
                    y={type == 'albums'
                        ? Math.min(250, (positions[i][0].y + positions[i][1].y) / 2 - 125)
                        : Math.min(250, (positions[i][0].y + positions[i][1].y) / 2 - 200)}
                    transform=""
                    clip-path="url(#clip{i})"
                />
                <defs>
                    <clipPath id="clip{i}">
                        <path
                            d="
                    M {positions[i][0].x} {positions[i][0].y},
                    L 250, 250
                    L {positions[i][1].x} {positions[i][1].y}
                    A 250 250 0 0 1 {positions[i][0].x} {positions[i][0].y}
                    "
                        />
                    </clipPath>
                </defs>
            </svg>
        {/each}
    </div>
    <svg
        width="23"
        height="26"
        viewBox="0 0 23 26"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        class="absolute -right-1 top-1/2 -translate-y-1/2"
    >
        <g filter="url(#filter0_d_101_11)">
            <path d="M4 11L20.5 1.47372L20.5 20.5263L4 11Z" fill="rgb(251, 189, 35)" />
        </g>
        <defs>
            <filter
                id="filter0_d_101_11"
                x="0"
                y="0.47372"
                width="22.5"
                height="25.0526"
                filterUnits="userSpaceOnUse"
                color-interpolation-filters="sRGB"
            >
                <feFlood flood-opacity="0" result="BackgroundImageFix" />
                <feColorMatrix
                    in="SourceAlpha"
                    type="matrix"
                    values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                    result="hardAlpha"
                />
                <feOffset dx="-1" dy="2" />
                <feGaussianBlur stdDeviation="1.5" />
                <feComposite in2="hardAlpha" operator="out" />
                <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.27 0" />
                <feBlend
                    mode="normal"
                    in2="BackgroundImageFix"
                    result="effect1_dropShadow_101_11"
                />
                <feBlend
                    mode="normal"
                    in="SourceGraphic"
                    in2="effect1_dropShadow_101_11"
                    result="shape"
                />
            </filter>
        </defs>
    </svg>
</div>
