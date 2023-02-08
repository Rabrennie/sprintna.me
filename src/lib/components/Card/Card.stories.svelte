<script>
    import { Meta, Story, Template } from '@storybook/addon-svelte-csf';

    import Card from './Card.svelte';
</script>

<Meta title="Card" component={Card} />

<Template let:args>
    <Card {...args}>Some content in the card!</Card>
</Template>

<Story name="Main" args={{ title: 'Card Title', class: '' }} />
