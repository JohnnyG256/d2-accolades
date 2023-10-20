import createClient, { type FetchOptions, type FetchResponse } from 'openapi-fetch';
import type { components, paths } from './api';
import { API_KEY } from '$env/static/private';

const headers: components['headers'] = {
	'X-API-Key': API_KEY
};

export const newClient = function (apiKey?: string, customFetch?: typeof fetch) {
	let headers: components['headers'] | undefined;

	if (apiKey !== undefined) {
		headers = { 'X-API-Key': apiKey };
	} else {
		headers = undefined;
	}

	return createClient<paths>({
		baseUrl: 'https://www.bungie.net/Platform',
		headers,
		fetch: customFetch
	}) as unknown as ReturnType<typeof createClient<paths>> & {
		GET: Promise<{error: ClientError}>
	}
};

type ClientError = {
	ErrorCode?: number;
	ThrottleSeconds?: number;
	ErrorStatus?: string;
	Message?: string;
	MessageData?: Record<string, unknown>;
};

export class BungoError extends Error {
	errorCode;
	throttleSeconds;
	errorStatus;
	messageData;

	constructor(info: ClientError) {
		super(info.Message);

		this.errorCode = info.ErrorCode;
		this.throttleSeconds = info.ThrottleSeconds;
		this.errorStatus = info.ErrorStatus;
		this.messageData = info.MessageData;
	}
}