<script>
    import { Meta, Story, Template } from '@storybook/addon-svelte-csf';

    import Spinner from './Spinner.svelte';
</script>

<Meta title="Spinner" component={Spinner} />

<Template let:args>
    <Spinner {...args}>Some content in the Spinner!</Spinner>
</Template>

<Story name="Main" args={{ items: ['one', 'two', 'three', 'four', 'five', 'six'], target: 2}} />
