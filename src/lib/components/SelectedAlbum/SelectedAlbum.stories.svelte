<script>
    import { Meta, Story, Template } from '@storybook/addon-svelte-csf';

    import SelectedAlbum from './SelectedAlbum.svelte';
</script>

<Meta title="SelectedAlbum" component={SelectedAlbum} />

<Template let:args>
    <SelectedAlbum {...args} />
</Template>

<Story name="Not Selected" args={{ name: 'Someone' }} />
<Story
    name="Selected"
    args={{
        name: 'Someone',
        albumName: "you'll be fine",
        albumImageUrl: 'https://i.scdn.co/image/ab67616d00001e02fec2691d20750b512ba92483',
        albumLink: 'https://open.spotify.com/album/5MutKcn3J1xzbBKOzr1oGI',
        artistName: 'Hot Mulligan',
    }}
/>
<Story
    name="Confetti"
    args={{
        name: 'Someone',
        albumName: "you'll be fine",
        albumImageUrl: 'https://i.scdn.co/image/ab67616d00001e02fec2691d20750b512ba92483',
        albumLink: 'https://open.spotify.com/album/5MutKcn3J1xzbBKOzr1oGI',
        artistName: 'Hot Mulligan',
        confetti: true,
    }}
/>
