<script lang="ts">
	import Seals from './Seals.svelte';

	export let data;

</script>

<Seals manifestRecords={data.manifestRecords} playerRecords={data.playerRecords}/>