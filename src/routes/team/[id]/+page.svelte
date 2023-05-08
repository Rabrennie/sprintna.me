<script lang="ts">
    import { page } from '$app/stores';
    import CreateRoomModal from './CreateRoomModal.svelte';
</script>

<div>
    {JSON.stringify($page.data.team)}
</div>

<CreateRoomModal />
