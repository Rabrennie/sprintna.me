<!--
  @component
  Generates an SVG column chart.
 -->
<script lang="ts">
    import { stringToHslColor } from '$lib/utils/stringToHslColor';
    import { getContext } from 'svelte';

    // @ts-ignore
    const { data, xGet, yGet, x, yRange, xScale, y } = getContext('LayerCake');

    $: columnWidth = (d: any) => {
        const vals = $xGet(d);
        return Math.abs(vals[1] - vals[0]);
    };

    $: columnHeight = (d: any) => {
        return $yRange[0] - $yGet(d);
    };
</script>

<g class="column-group">
    {#each $data as d, i}
        {@const colHeight = columnHeight(d)}
        {@const xGot = $xGet(d)}
        {@const xPos = Array.isArray(xGot) ? xGot[0] : xGot}
        {@const colWidth = $xScale.bandwidth ? $xScale.bandwidth() : columnWidth(d)}
        {@const yValue = $y(d)}
        <rect
            class="group-rect"
            data-id={i}
            data-range={$x(d)}
            data-count={yValue}
            x={xPos}
            y={$yGet(d)}
            width={colWidth}
            height={colHeight}
            fill={stringToHslColor(d.name, 55, 60)}
            stroke-width="0"
        />
    {/each}
</g>
