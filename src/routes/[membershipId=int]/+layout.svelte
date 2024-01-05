<script lang="ts">
	import Search from "../Search.svelte";

  export let data;
</script>
<nav>
  <Search />
  <a href={`/${data.membershipId}`}>Overview</a>
  <a href={`/${data.membershipId}/seals`}>Seals</a>
</nav>

<slot />