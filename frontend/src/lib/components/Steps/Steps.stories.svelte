<script>
    import { Meta, Story, Template } from '@storybook/addon-svelte-csf';

    import Steps from './Steps.svelte';
    import { StepState } from './StepState';
</script>

<Meta title="Steps" component={Steps} />

<Template let:args>
    <Steps {...args} />
</Template>

<Story
    name="Main"
    args={{
        steps: [
            { name: 'First', state: StepState.COMPLETED },
            { name: 'Second', state: StepState.CURRENT },
            { name: 'Third', state: StepState.FUTURE },
        ],
    }}
/>
