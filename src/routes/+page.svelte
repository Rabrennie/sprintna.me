<script lang="ts">
    import Button from '$lib/components/Button/Button.svelte';
    import { page } from '$app/stores';
    import { goToLogin, goToLogout } from '@rabrennie/sveltekit-auth/client';
</script>

<svelte:head>
    <title>sprintna.me</title>
</svelte:head>

<div class="flex flex-col">
    <div class="min-h-screen flex flex-col items-center justify-center">
        <div class="flex flex-col items-center w-[40rem] gap-12 text-center">
            <h1 class="font-sans text-5xl text-slate-50 font-bold leading-normal flex flex-col">
                <span>Say Goodbye to Uninspired</span>
                <span class="text-yellow-300">Sprint Names</span>
            </h1>
            <p class="flex flex-shrink text-lg text-slate-300">
                Are you tired of coming up with boring and uninspired names for your sprints? Look
                no further than sprintna.me! Our tool makes it easy to generate unique and exciting
                names for your next sprint.
            </p>
            <Button
                block={false}
                variant="warning"
                on:click={() => goToLogin($page.data, 'google')}
                class="bg-yellow-300">Get Started</Button
            >
        </div>
    </div>
</div>
