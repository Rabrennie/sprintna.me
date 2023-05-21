<script lang="ts">
    import { enhance } from '$app/forms';
    import Button from '$lib/components/Button/Button.svelte';
    import Card from '$lib/components/Card/Card.svelte';
    import TextInput from '$lib/components/TextInput/TextInput.svelte';

    import type { ActionData } from './$types';

    export let form: ActionData;
</script>

<div class="flex justify-center">
    <h1 class="absolute top-0 p-10 text-4xl text-primary-content">sprintna.me</h1>
    <div class="w-screen h-screen flex items-center justify-center">
        <Card title="Create a Team!" class="w-96">
            <form method="post" use:enhance class="flex flex-col gap-2">
                <TextInput placeholder="Team Name" name="name" errors={form?.errors}/>
                <Button type="submit">Create</Button>
            </form>
        </Card>
    </div>
</div>
