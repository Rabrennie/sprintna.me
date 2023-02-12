<script>
    import { Meta, Story, Template } from '@storybook/addon-svelte-csf';

    import Modal from './Modal.svelte';
</script>

<Meta title="Modal" component={Modal} />

<Template let:args>
    <Modal {...args}>
        <span slot="button">Some content in the Button!</span>
        <span slot="modal">Some content in the Modal!</span>
    </Modal>
</Template>

<Story name="Main" args={{ id: 'my-modal' }} />
<Story name="Not closable" args={{ id: 'my-modal', canClose: false}} />
