import { describe, it, expect } from 'vitest';
import { newClient } from './client';

describe('newClient', () => {
	it("should create a new client which can make requests to bungie api", async () => {
		const client = await newClient();
		const result = await client.GET("/Destiny2/Manifest/", {});

		expect(result.response.ok).toBe(true)
	})

	it("should allow for using an api-key to pass with requests", async () => {
		const client = await newClient(true);
		const result = await client.GET("/App/FirstParty/", {})

		expect(result.response.ok).toBe(true)
	})

	it("should not use an api key by default", async () => {
		const client = await newClient();
		const result = await client.GET("/App/FirstParty/", {});

		expect(result.response.ok).toBe(false)
	})

	it("should allow passing in a custom fetch function to use for requests", async () => {
		const mockFetch: typeof fetch = async function() {
			return Response.json({hey: "hi!"})
		}

		const client = await newClient(false, mockFetch);
		const result = await client.GET("/Destiny2/Manifest/", {});
		
		expect(await result.response.json()).toEqual({hey: "hi!"})
	})
});
