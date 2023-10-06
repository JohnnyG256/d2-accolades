<script lang="ts">
	import UserCard from './UserCard.svelte';

	export let data;
</script>

{#if data.searchResults.length === 0}
	<h1>No players found</h1>
{:else}
	{#each data.searchResults as user}
		<li>
			<UserCard info={user} />
		</li>
	{/each}
{/if}
