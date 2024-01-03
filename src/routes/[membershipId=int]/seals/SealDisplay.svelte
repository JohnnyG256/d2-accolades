<script lang="ts">
	import type { SealInfo } from './seal';

	export let sealInfo: SealInfo;
</script>

<div>
	{#if sealInfo.icon !== ''}
		<img src={'https://www.bungie.net' + sealInfo.icon} />
	{/if}

	<span>{sealInfo.name}</span>
	{#if sealInfo.timesGilded}
		<span>Times Gilded: {sealInfo.timesGilded}</span>
	{/if}
</div>
