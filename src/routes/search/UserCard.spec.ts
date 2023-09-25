// @vitest-environment jsdom

import { cleanup, render, screen } from '@testing-library/svelte';
import { afterEach, describe, expect, it } from 'vitest';
import UserCard from './UserCard.svelte';
import type { ComponentProps } from 'svelte';

const mockInfo: ComponentProps<UserCard>['userInfo'] = [
	{
		membershipId: "12345678",
		membershipType: 3,
		crossSaveOverride: 0,
		bungieGlobalDisplayName: 'Bob',
		bungieGlobalDisplayNameCode: 1234,
		iconPath: '/path/to/icon.png'
	}
];

afterEach(() => {
	cleanup();
});

describe('UserCard', () => {
	it('should show basic player info', () => {
		render(UserCard, { userInfo: mockInfo });

		const text = screen.getByText('Bob#1234');
		expect(text);

		const image = screen.getByRole('img');
		expect(image.getAttribute('src')).toBe('https://www.bungie.net/path/to/icon.png');
	});

	it('should use proper alt text for platform icon', () => {
		render(UserCard, { userInfo: [{ ...mockInfo[0], membershipType: 0 }] });
		screen.getByAltText('No Platform');

		render(UserCard, { userInfo: [{ ...mockInfo[0], membershipType: 1 }] });
		screen.getByAltText('Xbox');

		render(UserCard, { userInfo: [{ ...mockInfo[0], membershipType: 2 }] });
		screen.getByAltText('Playstation');

		render(UserCard, { userInfo: [{ ...mockInfo[0], membershipType: 3 }] });
		screen.getByAltText('Steam');

		render(UserCard, { userInfo: [{ ...mockInfo[0], membershipType: 4 }] });
		screen.getByAltText('Blizzard');

		render(UserCard, { userInfo: [{ ...mockInfo[0], membershipType: 5 }] });
		screen.getByAltText('Stadia');

		render(UserCard, { userInfo: [{ ...mockInfo[0], membershipType: 999 }] });
		screen.getByAltText('Unknown Platform');
	});

	it("should link to the player's info page", () => {
		render(UserCard, { userInfo: mockInfo });

		const link = screen.getByRole('link');
		expect(link.getAttribute('href')).toBe('/3/12345678');
	});

	it('should use info for primary platform if crossave is active', () => {
		render(UserCard, {
			userInfo: [
				{ ...mockInfo[0], crossSaveOverride: 2 },
				{
					membershipId: "87654321",
					membershipType: 2,
					crossSaveOverride: 2,
					bungieGlobalDisplayName: 'Bobby',
					bungieGlobalDisplayNameCode: 4321,
					iconPath: '/different/icon/path.png'
				}
			]
		});

		const link = screen.getByRole('link', { name: /Bobby#4321/ });
		expect(link.getAttribute('href')).toBe('/2/87654321');

		const image = screen.getByRole('img');
		expect(image.getAttribute('src')).toBe('https://www.bungie.net/different/icon/path.png');
	});
});
