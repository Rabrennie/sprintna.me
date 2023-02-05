<script lang="ts">
    export let title: string;
    let className: string = '';
	export { className as class };
</script>

<div class={`card bg-base-100 ${className}`}>
    <div class="card-body">
        <h2 class="card-title">{title}</h2>
        <slot></slot>
    </div>
</div>
