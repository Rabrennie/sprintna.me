<script>
    import { Meta, Story, Template } from '@storybook/addon-svelte-csf';

    import Button from './Button.svelte';
</script>

<Meta title="Button" component={Button} />

<Template let:args>
    <Button {...args}>Some content in the Button!</Button>
</Template>

<Story name="Main" args={{  }} />
