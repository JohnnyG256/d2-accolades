import { expect, test, type Locator } from '@playwright/test';

let searchBox: Locator;

test.beforeEach(async ({ page }) => {
	await page.goto('/');
	searchBox = page.getByRole('searchbox');
});

test('searching for player should return proper search results', async ({ page }) => {
	await searchBox.fill('leopard');
	await searchBox.press('Enter');

	await expect(page).toHaveURL(/\/search/);
	const searchResults = page.getByRole('listitem').getByRole('link');

	// Should show all pages of results in one page
	expect(await searchResults.count()).toBeGreaterThan(30);

	for (const link of await searchResults.all()) {
		await expect(link).toHaveAttribute('href', /^\/\d\/\d{19}$/);
	}

	// Should only show primary account if crossave is active
	expect(await searchResults.getByText('leopard#4271').count()).toBe(1);
});

test("should redirect to player's report page if only one player is found", async ({ page }) => {
	await searchBox.fill('Electrobrains');
	await searchBox.press('Enter');

	await expect(page).toHaveURL('/3/4611686018505157425');
});

test("should support queries which include player's hash code", async ({ page }) => {
	await searchBox.fill('leopard#4271');
	await searchBox.press('Enter');

	await expect(page).toHaveURL('/3/4611686018467356666');
});

test('should handle a query with no found players', async ({ page }) => {
	await searchBox.fill('giudvcoiamv');
	await searchBox.press('Enter');

	await expect(page.getByText('No players found')).toBeVisible();
});
