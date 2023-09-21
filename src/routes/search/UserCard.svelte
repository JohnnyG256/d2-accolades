<script lang="ts">
	import type { components } from '$lib/bungie/api';

	export let userInfo: components['schemas']['User.UserSearchResponseDetail']['destinyMemberships'];

	$: info = userInfo?.find(
		(info) => info.crossSaveOverride === 0 || info.crossSaveOverride === info.membershipType
	);

	$: userLink = `/${info?.membershipId}/${info?.membershipType}`;
	$: userName = `${info?.bungieGlobalDisplayName}#${info?.bungieGlobalDisplayNameCode}`;
	$: platformIconLink = `https://www.bungie.net${info?.iconPath}`;

	let platform: string;
	$: {
		switch (info?.membershipType) {
			case 0:
				platform = 'No Platform';
				break;
			case 1:
				platform = 'Xbox';
				break;
			case 2:
				platform = 'Playstation';
				break;
			case 3:
				platform = 'Steam';
				break;
			case 4:
				platform = 'Blizzard';
				break;
			case 5:
				platform = 'Stadia';
				break;
			default:
				platform = 'Unknown Platform';
		}
	}
</script>

<a href={userLink}>
	<img src={platformIconLink} alt={platform} />
	{userName}
</a>
