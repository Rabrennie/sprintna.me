<script lang="ts">
	export let variant: undefined | 'primary' | 'success' | 'warning' = undefined;
	export let block: boolean = true;

    let variantMap = {
        primary: 'btn-primary',
        success: 'btn-success',
        warning: 'btn-warning',
    }
</script>

<button class="btn {block && 'btn-block'} {variant && variantMap[variant]}" type="button" on:click
	><slot /></button
>
