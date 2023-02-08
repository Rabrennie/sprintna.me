<script lang="ts">
    export let placeholder: string = '';
    export let value: string = '';
    export let disabled: boolean = false;
</script>

<div class="form-control w-full">
    <input bind:value type="text" {placeholder} class="input input-bordered w-full" {disabled}/>
</div>
