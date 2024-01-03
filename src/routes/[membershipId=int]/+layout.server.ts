import { API_KEY } from '$env/static/private';
import { BungoError, newClient } from '$lib/bungie/client.js';
import { error } from '@sveltejs/kit';

export const load = async function ({ params, fetch }) {
	const client = newClient(API_KEY, fetch);

	const profileDataResponse = await client.GET(
		'/User/GetMembershipsById/{membershipId}/{membershipType}/',
		{
			params: { path: { membershipId: params.membershipId, membershipType: 0 } }
		}
	);

	if (profileDataResponse.error !== undefined) {
		throw error(500, profileDataResponse.error.Message);
	}

	const profileData = profileDataResponse.data.Response;

	if (profileData === undefined) {
		throw error(500)
	}

	const {membershipId, membershipType} = profileData.destinyMemberships?.find(
		(destinyMembership) =>
			destinyMembership.crossSaveOverride === 0 ||
			destinyMembership.crossSaveOverride === destinyMembership.membershipType
	) ?? {}

	if (membershipId === undefined || membershipType === undefined) {
		throw error(500);
	}

	const manifestResponse = await client.GET("/Destiny2/Manifest/", {});
	if (manifestResponse.error !== undefined) {
		throw new BungoError(manifestResponse.error)
	}
	
	return {profileData, membershipId, membershipType, manifestPaths: manifestResponse.data.Response };
};
