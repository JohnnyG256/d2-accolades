// @vitest-environment jsdom

import { screen, render, cleanup } from '@testing-library/svelte';
import { afterEach, describe, expect, it } from 'vitest';
import SearchNav from './SearchNav.svelte';

afterEach(() => {
	cleanup();
});

describe('SearchNav', () => {
	it('should display links to navigate to previous and next pages of search results', () => {
		render(SearchNav, {
			currentUrl: new URL('https://www.url.com/path/thing?hi=hello&page=2'),
			results: { hasMore: true }
		});

		const previous = screen.getByRole('link', { name: 'Previous' });
		const next = screen.getByRole('link', { name: 'Next' });

		expect(previous.getAttribute('href')).toBe('/path/thing?hi=hello&page=1');
		expect(next.getAttribute('href')).toBe('/path/thing?hi=hello&page=3');
	});

	it('should not display previous link if current page is 0', () => {
		render(SearchNav, {
			currentUrl: new URL('https://www.url.com/?page=0'),
			results: { hasMore: true }
		});

		const previous = screen.queryByRole('link', { name: 'Previous' });
		expect(previous).toBeNull();

		const next = screen.queryByRole('link', { name: 'Next' });
		expect(next?.getAttribute('href')).toBe('/?page=1');
	});

	it('should not display next link if there are no more search results', () => {
		render(SearchNav, {
			currentUrl: new URL('https://www.url.com/?page=1'),
			results: { hasMore: false }
		});

		const previous = screen.getByRole('link', { name: 'Previous' });
		expect(previous.getAttribute('href')).toBe('/?page=0');

		const next = screen.queryByRole('link', { name: 'Next' });
		expect(next).toBeNull();
	});

	it('should not display any links if current page is 0 and there are no more search results', () => {
		render(SearchNav, {
			currentUrl: new URL('https://www.url.com/?page=0'),
			results: { hasMore: false }
		});

		const result = screen.queryByRole('link');
		expect(result).toBeNull();
	});
});
