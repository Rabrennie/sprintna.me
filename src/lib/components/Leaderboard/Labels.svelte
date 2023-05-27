<!--
  @component
  Generates an SVG column chart.
 -->
<script lang="ts">
    import { getContext } from 'svelte';

    // @ts-ignore
    const { data, xGet, xScale, containerHeight } = getContext('LayerCake');

    $: columnWidth = (d: any) => {
        const vals = $xGet(d);
        return Math.abs(vals[1] - vals[0]);
    };
</script>

<div>
    {#each $data as d, i}
        {@const xGot = $xGet(d)}
        {@const xPos = Array.isArray(xGot) ? xGot[0] : xGot}
        {@const colWidth = $xScale.bandwidth ? $xScale.bandwidth() : columnWidth(d)}
        <div
            class="absolute text-center"
            style={`left: ${xPos}px; width: ${colWidth}px; top: ${$containerHeight - 32}px`}
        >
            <div class="tooltip tooltip-bottom" data-tip={`${d.name} - ${d.count}`}>
                <div class="avatar">
                    <div class="w-8 rounded-full">
                        <img src={d.image} alt={d.name} />
                    </div>
                </div>
            </div>
        </div>
    {/each}
</div>
