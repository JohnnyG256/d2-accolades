<script lang="ts">
	import type { SealInfo } from './seal';

	export let sealInfo: SealInfo;
</script>

<div>
		<img src={'https://www.bungie.net' + sealInfo.icon}/>

	<span>{sealInfo.name}</span>
	{#if sealInfo.timesGilded}
		<span>Times Gilded: {sealInfo.timesGilded}</span>
	{/if}
</div>

<style>
	div {
		display: flex;
		flex-direction: column;
		padding: 1em;
		align-items: center;
	}

	img {
		width: 150px
	}
</style>

