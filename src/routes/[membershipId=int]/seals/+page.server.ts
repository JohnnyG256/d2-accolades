import { API_KEY } from '$env/static/private';
import type { components } from '$lib/bungie/api.js';
import { newClient } from '$lib/bungie/client.js';
import { error, json } from '@sveltejs/kit';

export const load = async function ({ parent, fetch }) {
	const { membershipId, membershipType, manifestPaths } = await parent();

	const client = newClient(API_KEY, fetch);

	const recordsResponse = await client.GET(
		'/Destiny2/{membershipType}/Profile/{destinyMembershipId}/',
		{
			params: {
				path: {
					membershipType,
					destinyMembershipId: membershipId
				},
				query: { components: [900, 1200] }
			}
		}
	);

	if (recordsResponse.error !== undefined) {
		console.log(recordsResponse.error);
		throw error(500, recordsResponse.error.Message);
	}

	const playerRecords = recordsResponse.data.Response?.profileRecords;
	if (playerRecords?.data?.records === undefined) {
		throw error(500);
	}


	const manifestRecordsPath = manifestPaths?.jsonWorldComponentContentPaths?.en.DestinyRecordDefinition

	if (!manifestRecordsPath) {
		throw error(500)
	};

	const manifestResponse = await fetch(`https://www.bungie.net${manifestRecordsPath}`);
	if (!manifestResponse.ok) {
		throw error(500, manifestResponse.statusText);
	}

	const manifestRecords = await manifestResponse.json() as Record<number, components["schemas"]["Destiny.Definitions.Records.DestinyRecordDefinition"]>

	return { playerRecords: playerRecords.data.records, manifestRecords };
};
