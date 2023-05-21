<script lang="ts">
    import Button from '$lib/components/Button/Button.svelte';
    import Card from '$lib/components/Card/Card.svelte';
    import { goToLogin } from '@rabrennie/sveltekit-auth/client';
    import type { PageData } from './$types';

    export let data: PageData;
</script>

<div class="flex w-full h-screen items-center justify-center">
    <Card title={`You have been invited to join "${data.name}"`}>
        <div class="pt-4">
            {#if data.session.user}
                <form method="POST">
                    <input type="hidden" value={data.invite} name="invite" />
                    <Button type="submit">Join</Button>
                </form>
            {:else}
                <Button on:click={() => goToLogin(data, 'google')}>Log in to join</Button>
            {/if}
        </div>
    </Card>
</div>
