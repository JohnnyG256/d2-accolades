import createClient from 'openapi-fetch';
import type { components, paths } from '$lib/bungie-api';
import { API_KEY } from '$env/static/private';

const headers: components['headers'] = {
	'X-API-Key': API_KEY
};

export const client = createClient<paths>({
	baseUrl: 'https://www.bungie.net/Platform',
	headers
});
