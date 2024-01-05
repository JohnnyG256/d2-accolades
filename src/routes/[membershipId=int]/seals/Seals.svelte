<script lang="ts">
	import SealDisplay from './SealDisplay.svelte';
	import { Seal, type PlayerRecord, type ManifestRecord } from './seal';

	export let manifestRecords: Record<number, ManifestRecord>;
	export let playerRecords: Record<number, PlayerRecord>;

	const seals = Seal.fromManifest(manifestRecords);

	const sealData = seals.map((seal) => seal.getInfo(playerRecords));

	const obtained = sealData.filter((seal) => seal.completed);
	const unobtained = sealData.filter((seal) => !seal.completed);
</script>

<h1>Obtained</h1>
<div>
	{#each obtained as seal}
		<SealDisplay sealInfo={seal} />
	{/each}
</div>
<br />
<h1>Unobtained</h1>
<div>
	{#each unobtained as seal}
		<SealDisplay sealInfo={seal} />
	{/each}
</div>


<style>
	div {
		display: flex;
		flex-wrap: wrap;
	}

	h1 {
		border-bottom: solid #999;
	}
</style>