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

<div class="relative">
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
                    width={500}
                    x={0}
                    y={0}
                    transform=""
                    clip-path="url(#clip{i})"
                    style="
                filter: blur(20px);"
                />
                <image
                    href={item}
                    height={250}
                    width={250}
                    x={250}
                    y={Math.min(250, (positions[i][0].y + positions[i][1].y) / 2 - 125)}
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
    <div
        class="absolute right-0 top-1/2 w-4 h-1 border-solid border-r-red-400 border-r-8 border-y-transparent border-y-8 border-l-0 -translate-y-1/2"
    />
</div>
