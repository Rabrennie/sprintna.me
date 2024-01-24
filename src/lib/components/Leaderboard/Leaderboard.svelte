<script lang="ts">
    import { stringToHslColor } from '$lib/utils/stringToHslColor';

    export let data: { name: string; image: string; count: number }[];

    $: maxCount = Math.max(...data.map((d) => d.count));
</script>

<div class="chart-container flex flex-col gap-4">
    <ul class="chart" style="--max-count: {maxCount}">
        {#each data as d, i}
            {#if d.count > 0}
                <li
                    class="tooltip tooltip-top"
                    data-tip={`${d.name} - ${d.count}`}
                    style="--count: {d.count}; --index: {i}; --fill: {d.count > 0
                        ? stringToHslColor(d.name, 55, 60)
                        : 'transparent'};"
                >
                    {d.count}
                </li>
            {/if}
        {/each}
    </ul>
    <ul class="labels">
        {#each data as d, i}
            {#if d.count > 0}
                <li data-tip={`${d.name} - ${d.count}`} style="--count: {d.count}; --index: {i};">
                    <div class="avatar">
                        <div class="w-8 rounded-full">
                            <img src={d.image} alt={d.name} />
                        </div>
                    </div>
                </li>
            {/if}
        {/each}
    </ul>
</div>

<style>
    .chart-container {
        width: 100%;
    }

    .chart,
    .labels {
        display: grid;
        grid-auto-rows: 1fr;
        grid-auto-columns: 1fr;
        gap: 0 2rem;
        max-height: 150px;
    }

    .chart > li {
        color: transparent;
        background-color: var(--fill);
        border-radius: 0.15rem 0.15rem 0 0;
        grid-row: calc(var(--max-count) - var(--count) + 1) / span var(--count);
        grid-column: calc(var(--index) + 1);
    }

    .labels > li {
        display: flex;
        align-items: center;
        justify-content: center;
        grid-column: calc(var(--index) + 1);
    }
</style>
