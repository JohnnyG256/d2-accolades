<script lang="ts">
	import type { components } from '$lib/bungie/api';

	export let currentUrl: URL;
	export let results: components['schemas']['User.UserSearchResponse'];

	$: currentPage = parseInt(currentUrl.searchParams.get('page') ?? '0');
	$: if (Number.isNaN(currentPage)) {
		currentPage = 0;
	}
	let previousParams: URLSearchParams;
	let nextParams: URLSearchParams;

	$: {
		previousParams = new URLSearchParams(currentUrl.searchParams);
		previousParams.set('page', (currentPage - 1).toString());
	}

	$: {
		nextParams = new URLSearchParams(currentUrl.searchParams);
		nextParams.set('page', (currentPage + 1).toString());
	}
</script>

{#if currentPage > 0}
	<a href={`${currentUrl.pathname}?${previousParams}`}>Previous</a>
{/if}

{#if results.hasMore}
	<a href={`${currentUrl.pathname}?${nextParams}`}>Next</a>
{/if}
