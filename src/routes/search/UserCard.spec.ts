// @vitest-environment jsdom

import { cleanup, render, screen } from '@testing-library/svelte';
import { afterEach, describe, expect, it } from 'vitest';
import UserCard from './UserCard.svelte';
import type { ComponentProps } from 'svelte';

const mockInfo: ComponentProps<UserCard>['info'] = {
	membershipId: '12345678',
	membershipType: 3,
	crossSaveOverride: 0,
	bungieGlobalDisplayName: 'Bob',
	bungieGlobalDisplayNameCode: 1234,
	iconPath: '/path/to/icon.png'
};

afterEach(() => {
	cleanup();
});

describe('UserCard', () => {
	it('should show basic player info', () => {
		render(UserCard, { info: mockInfo });

		const text = screen.getByText('Bob#1234');
		expect(text);

		const image = screen.getByRole('img');
		expect(image.getAttribute('src')).toBe('https://www.bungie.net/path/to/icon.png');
	});

	it('should use proper alt text for platform icon', () => {
		render(UserCard, { info: { ...mockInfo, membershipType: 0 } });
		screen.getByAltText('No Platform');

		render(UserCard, { info: { ...mockInfo, membershipType: 1 } });
		screen.getByAltText('Xbox');

		render(UserCard, { info: { ...mockInfo, membershipType: 2 } });
		screen.getByAltText('Playstation');

		render(UserCard, { info: { ...mockInfo, membershipType: 3 } });
		screen.getByAltText('Steam');

		render(UserCard, { info: { ...mockInfo, membershipType: 4 } });
		screen.getByAltText('Blizzard');

		render(UserCard, { info: { ...mockInfo, membershipType: 5 } });
		screen.getByAltText('Stadia');

		render(UserCard, { info: { ...mockInfo, membershipType: 999 } });
		screen.getByAltText('Unknown Platform');
	});

	it("should link to the player's info page", () => {
		render(UserCard, { info: mockInfo });

		const link = screen.getByRole('link');
		expect(link.getAttribute('href')).toBe('/3/12345678');
	});
});
