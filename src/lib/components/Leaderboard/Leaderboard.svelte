<script lang="ts">
    import Column from '$lib/components/Leaderboard/Column.svelte';
    import { LayerCake, Svg, Html } from 'layercake';
    import { scaleBand } from 'd3-scale';
    import Labels from '$lib/components/Leaderboard/Labels.svelte';

    export let data: { name: string; image: string; count: number }[];
</script>

<div class="chart-container">
    <LayerCake
        padding={{ top: 0, right: 0, bottom: 45, left: 0 }}
        {data}
        x="name"
        y="count"
        xScale={scaleBand().paddingInner(0.2).round(true)}
        xDomain={data.map((d) => d.name)}
        yDomain={[0, data[0].count]}
    >
        <Svg>
            <Column />
        </Svg>

        <Html>
            <Labels />
        </Html>
    </LayerCake>
</div>

<style>
    .chart-container {
        width: 100%;
        height: 150px;
    }
</style>
