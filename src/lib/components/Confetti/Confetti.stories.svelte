<script>
    import { Meta, Story, Template } from '@storybook/addon-svelte-csf';

    import Confetti from './Confetti.svelte';
</script>

<Meta title="Confetti" component={Confetti} />

<Template let:args>
    <Confetti {...args}>
        <div class="w-20 h-20 bg-base-100">
        </div>
    </Confetti>
</Template>

<Story name="Main" args={{ fireOnLoad: true }} />
