<script lang="ts">
	export let id: string;

	let open = false;

	export function toggle() {
		open = !open;
	}

	export let buttonVariant: undefined | 'primary' | 'success' = undefined;

	let buttonVariantMap = {
		primary: 'btn-primary',
		success: 'btn-success'
	};
</script>

<label for={id} class="btn {buttonVariant && buttonVariantMap[buttonVariant]}"
	><slot name="button" /></label
>

<input type="checkbox" {id} class="modal-toggle" bind:checked={open} />
<label for={id} class="modal cursor-pointer">
	<label class="modal-box relative" for="">
		<slot name="modal" />
	</label>
</label>
