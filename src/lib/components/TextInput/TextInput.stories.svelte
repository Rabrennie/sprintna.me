<script>
    import { Meta, Story, Template } from '@storybook/addon-svelte-csf';

    import TextInput from './TextInput.svelte';
</script>

<Meta title="TextInput" component={TextInput} />

<Template let:args>
    <TextInput {...args} />
</Template>

<Story name="Main" args={{ value: 'My Text' }} />
