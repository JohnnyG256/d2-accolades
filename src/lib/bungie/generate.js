import openapiTS from 'openapi-typescript';
import fs from 'node:fs';

const rawOutput = await openapiTS(
	'https://raw.githubusercontent.com/Bungie-net/api/master/openapi.json',
	{
		transform(schemaObject) {
			if (schemaObject.format === 'int64') {
				return 'string';
			}
		}
	}
);

// Add response types for 500 status
const output = rawOutput.replaceAll(
	/(?<=responses: \{\W*200: .*;)/g,
	`500: {
		content: {
			"application/json": {
				ErrorCode?: number;
				ThrottleSeconds?: number;
				ErrorStatus?: string;
				Message?: string;
				MessageData?: Record<string, unknown>;
			}
		}
	}`
);

fs.writeFileSync('./src/lib/bungie/api.ts', output);
