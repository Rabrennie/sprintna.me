<script lang="ts">
	import anime from 'animejs/lib/anime.es.js';
	import { createEventDispatcher } from 'svelte';

	export let items: string[] = [];
	export let target: number = 0;

	let myEl: HTMLDivElement;

	const dispatch = createEventDispatcher();

	function spin(): any {
		if (myEl && items.length) {
			anime({
				targets: myEl,
				rotate:
					1080 -
					(target / items.length) * 360 +
					(Math.random() * ((1 / items.length) * 360) - ((1 / items.length) * 360) / 2) +
					'deg',
				duration: 10000,
				easing: 'cubicBezier(0.265, -0.270, 0.020, 1.000)',
				delay: 1000,
				complete: () => dispatch('complete')
			});
		}
	}

	$: myEl && spin();
</script>

<div
	class="relative border-slate-100 border rounded-full p-16"
	style="min-width: 500px; min-height: 500px; max-height: 500px; max-width: 500px;"
	bind:this={myEl}
>
	{#each items as item, i}
		<div
			class="pr-8 pl-16 whitespace-nowrap text-ellipsis overflow-hidden"
			style="width: 250px;
    text-align: right;
    position: absolute;
    top: 226px;
    left: 250px;
    transform-origin: center left;
    transform: rotate({(i / items.length) * 360}deg);"
		>
			{item}
		</div>
		<div
			class="bg-slate-100"
			style="width: 250px;
        height: 1px;
        text-align: right;
        position: absolute;
        top: 249px;
        left: 249px;
        transform-origin: center left;
        transform: rotate({(i / items.length) * 360 + ((1 / items.length) * 360) / 2}deg);"
		/>
	{/each}
</div>
