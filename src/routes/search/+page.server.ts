import { redirect } from '@sveltejs/kit';
import type { components } from '$lib/bungie/api.js';

export const load = async function ({ url, fetch }) {
	const searchResults = (await (
		await fetch(url.search, {})
	).json()) as components['schemas']['User.UserInfoCard'][];

	if (searchResults.length === 1) {
		const user = searchResults[0];
		throw redirect(302, `/${user.membershipId}`);
	}

	return { searchResults };
};
