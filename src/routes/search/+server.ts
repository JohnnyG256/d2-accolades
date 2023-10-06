import { newClient } from '$lib/bungie/client.js';
import { error } from '@sveltejs/kit';

export const GET = async function ({ url, fetch }) {
	const client = await newClient(true, fetch);

	const name = url.searchParams.get('name');
	if (!name) {
		throw error(400);
	}

	const pages = parseInt(url.searchParams.get('pages') ?? '0');
	if (isNaN(pages)) {
		throw error(422);
	}

	const regexMatch = /^(.*?)(?:#(\d{4}))?$/.exec(name);

	if (regexMatch === null) {
		return new Response(undefined, { status: 500 });
	}

	const [, displayName, nameCode] = regexMatch;

	if (nameCode === undefined) {
		const searchResults = [];
		let response;
		let page = 0;

		do {
			response = (
				await client.POST('/User/Search/GlobalName/{page}/', {
					params: { path: { page } },
					body: { displayNamePrefix: displayName }
				})
			).data?.Response;

			if (response?.searchResults == null) {
				break;
			}

			const userInfos = response.searchResults.map((user) =>
				user.destinyMemberships === undefined
					? undefined
					: user.destinyMemberships.find(
							(platform) =>
								platform.crossSaveOverride === 0 ||
								platform.crossSaveOverride === platform.membershipType
					  )
			);

			searchResults.push(...userInfos);

			page++;
			if (pages && page >= pages) {
				break;
			}
		} while (response?.hasMore);

		return Response.json(searchResults.filter((result) => result !== undefined));
	}

	const searchResults = (
		await client.POST('/Destiny2/SearchDestinyPlayerByBungieName/{membershipType}/', {
			params: { path: { membershipType: -1 } },
			body: { displayName, displayNameCode: parseInt(nameCode) }
		})
	).data?.Response;
	console.log(searchResults);

	return Response.json(
		searchResults?.filter(
			(platform) =>
				platform.crossSaveOverride === 0 || platform.crossSaveOverride === platform.membershipType
		) ?? []
	);
};
