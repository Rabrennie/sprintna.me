<script lang="ts">
    import { StepState } from './StepState';

    interface Step {
        name: string;
        state: StepState;
    }

    const backgrounds = {
        [StepState.COMPLETED]: 'bg-success',
        [StepState.CURRENT]: 'bg-primary',
        [StepState.FUTURE]: 'bg-base-100',
    };

    export let steps: Step[] = [];
</script>

<div class="flex justify-center gap-x-12">
    {#each steps as step, index}
        <div class="flex flex-col justify-center items-center gap-y-3">
            <div
                class="rounded-full {backgrounds[
                    step.state
                ]} text-primary-content w-10 h-10 flex justify-center items-center"
            >
                {step.state === StepState.COMPLETED ? '✓' : index + 1}
            </div>
            <div>{step.name}</div>
        </div>
    {/each}
</div>
