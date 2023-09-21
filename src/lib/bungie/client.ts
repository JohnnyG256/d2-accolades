import createClient from 'openapi-fetch';
import type { components, paths } from './api';
import { API_KEY } from '$env/static/private';

const headers: components['headers'] = {
	'X-API-Key': API_KEY
};

export const newClient = async function (apiKey = false, customFetch?: typeof fetch) {
	let headers: components["headers"] | undefined
	
	if (apiKey) {
	const module =await import("$env/static/private")
	headers = {"X-API-Key": module.API_KEY}
	} else {
		headers = undefined
	}

	return createClient<paths>({
		baseUrl: 'https://www.bungie.net/Platform',
		headers,
		fetch: customFetch
	});
};
