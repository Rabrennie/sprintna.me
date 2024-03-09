<script>
    import { Meta, Story, Template } from '@storybook/addon-svelte-csf';

    import Spinner from './Spinner.svelte';
</script>

<Meta title="Spinner" component={Spinner} />

<Template let:args>
    <Spinner {...args}>Some content in the Spinner!</Spinner>
</Template>

<Story
    name="Main"
    args={{
        items: [
            'https://i.scdn.co/image/ab67616d0000b27346f9bf1154c7205b0e8b1667',
            'https://i.scdn.co/image/ab67616d00001e02fc3ff54493fcc890bcaa036c',
            'https://i.scdn.co/image/ab67616d00001e0207f215c81bfa2c35a2276eec',
            'https://i.scdn.co/image/ab67616d00001e0248113e42e6364509694507d2',
            'https://i.scdn.co/image/ab67616d00001e021172e6fea73f73597a3e7fa6',
            'https://i.scdn.co/image/ab67616d00001e02863f4540e18c97fd196d1116'
        ],
        target: 0,
        type: 'albums'
    }}
/>

<Story
    name="Movies"
    args={{
        items: [
            'https://m.media-amazon.com/images/M/MV5BNDIzMTk4NDYtMjg5OS00ZGI0LWJhZDYtMzdmZGY1YWU5ZGNkXkEyXkFqcGdeQXVyMTI5NzUyMTIz._V1_SX300.jpg',
            'https://m.media-amazon.com/images/M/MV5BOGZhM2FhNTItODAzNi00YjA0LWEyN2UtNjJlYWQzYzU1MDg5L2ltYWdlL2ltYWdlXkEyXkFqcGdeQXVyMTQxNzMzNDI@._V1_SX300.jpg',
            'https://m.media-amazon.com/images/M/MV5BOGZhM2FhNTItODAzNi00YjA0LWEyN2UtNjJlYWQzYzU1MDg5L2ltYWdlL2ltYWdlXkEyXkFqcGdeQXVyMTQxNzMzNDI@._V1_SX300.jpg',
            'https://m.media-amazon.com/images/M/MV5BOGZhM2FhNTItODAzNi00YjA0LWEyN2UtNjJlYWQzYzU1MDg5L2ltYWdlL2ltYWdlXkEyXkFqcGdeQXVyMTQxNzMzNDI@._V1_SX300.jpg',
            'https://m.media-amazon.com/images/M/MV5BOGZhM2FhNTItODAzNi00YjA0LWEyN2UtNjJlYWQzYzU1MDg5L2ltYWdlL2ltYWdlXkEyXkFqcGdeQXVyMTQxNzMzNDI@._V1_SX300.jpg'
        ],
        target: 1,
        type: 'movies'
    }}
/>
