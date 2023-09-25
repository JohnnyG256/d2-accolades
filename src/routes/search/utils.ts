import type { components } from '$lib/bungie/api';

export const getPrimaryPlatformData = function (
	data: components['schemas']['User.UserSearchResponseDetail']['destinyMemberships']
) {
	return data?.find(
		(account) =>
			account.crossSaveOverride === 0 || account.crossSaveOverride === account.membershipType
	);
};
