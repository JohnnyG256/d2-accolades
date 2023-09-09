import { describe, it, expect } from 'vitest';
import { client } from './bungie-fetch';

describe('client', () => {
	it('should successfully make requests to the bungie api', async () => {
		const response = await client.GET('/Destiny2/Manifest/', {});
		expect(response.response.ok).toBe(true);
	});
});
