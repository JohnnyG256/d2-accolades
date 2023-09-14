<script lang="ts">
	import { page } from '$app/stores';
	import UserCard from './UserCard.svelte';
	import SearchNav from './SearchNav.svelte';

	export let data;

	$: results = data.searchResults ?? [];
</script>

{#each results as user}
	<UserCard userInfo={user.destinyMemberships} />
{/each}

<SearchNav currentUrl={$page.url} results={data} />
