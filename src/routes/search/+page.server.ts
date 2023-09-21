import { newClient } from '$lib/bungie/client';
import { error, redirect } from '@sveltejs/kit';
import { getPrimaryPlatformData } from './utils.js';

export const load = async function ({ url, fetch }) {
	const name = url.searchParams.get('name');
	const pageString = url.searchParams.get('page') ?? '0';

	if (!name) {
		throw error(404);
	}

	const page = parseInt(pageString);
	if (Number.isNaN(page)) {
		throw error(400);
	}

	const client = await newClient(true, fetch)

	const response = await client.POST('/User/Search/GlobalName/{page}/', {
		params: { path: { page: page } },
		body: { displayNamePrefix: name }
	});

	const responseData = response.data?.Response;

	if (!response.response.ok || !responseData) {
		console.log(response.response)
		throw error(500);
	}

	if (
		responseData.searchResults?.length === 1 &&
		responseData.page === 0 &&
		!responseData.hasMore
	) {
		const primaryData = getPrimaryPlatformData(responseData.searchResults[0]['destinyMemberships']);

		if (primaryData === undefined) {
			throw error(500);
		}

		throw redirect(300, `/${primaryData.membershipId}/${primaryData.membershipType}`);
	}

	return responseData;
};
