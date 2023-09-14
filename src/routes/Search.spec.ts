// @vitest-environment jsdom

import { afterEach, describe, expect, it } from 'vitest';
import Search from './Search.svelte';
import { screen, cleanup, render } from '@testing-library/svelte';

afterEach(() => {
	cleanup();
});

describe('Search', () => {
	it('should redirect to search page on submission', () => {
		render(Search);

		const form = screen.getByRole('search');
		expect(form.getAttribute('action')).toBe('/search');
	});

	it('should pass the correct query parameter on submission', () => {
		render(Search);

		const search = screen.getByRole('searchbox');
		expect(search.getAttribute('name')).toBe('name');
	});
});
