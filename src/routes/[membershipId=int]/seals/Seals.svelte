<script lang="ts">
	import SealDisplay from './SealDisplay.svelte';
import { Seal, type PlayerRecord, type ManifestRecord } from './seal';

	export let manifestRecords: Record<number, ManifestRecord>;
	export let playerRecords: Record<number, PlayerRecord>;

	const seals = Seal.fromManifest(manifestRecords);

	const sealData = seals.map((seal) => seal.getInfo(playerRecords));
  console.log(manifestRecords)

	const obtained = sealData.filter((seal) => seal.completed);
	const unobtained = sealData.filter((seal) => !seal.completed);
</script>

<h3>Obtained</h3>
{#each obtained as seal}
  <SealDisplay sealInfo={seal}/>
{/each}

<h3>Unobtained</h3>
{#each unobtained as seal}
<SealDisplay sealInfo={seal} />
{/each}
