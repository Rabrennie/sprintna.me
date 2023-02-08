<script lang="ts">
	export let id: string;

	export let open: boolean = false;

	export function toggle() {
		open = !open;
	}

	export let buttonVariant: undefined | 'primary' | 'success' = undefined;

	let buttonVariantMap = {
		primary: 'btn-primary',
		success: 'btn-success'
	};
</script>

{#if $$slots.button}
	<label for={id} class="btn {buttonVariant && buttonVariantMap[buttonVariant]}"
		><slot name="button" /></label
	>
{/if}
<input type="checkbox" {id} class="modal-toggle" bind:checked={open} />
<label for={id} class="modal cursor-pointer">
	<label class="modal-box relative" for="">
		<slot name="modal" />
	</label>
</label>
