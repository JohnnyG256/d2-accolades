import { describe, expect, it } from 'vitest';
import { getPrimaryPlatformData } from './utils';

describe('getPrimaryPlatformData', () => {
	it('should return the data of the singular platform if cross save is not active', () => {
		const result = getPrimaryPlatformData([
			{ bungieGlobalDisplayName: 'Bob', crossSaveOverride: 0 }
		]);
		expect(result).toStrictEqual({ bungieGlobalDisplayName: 'Bob', crossSaveOverride: 0 });
	});

	it('should return the data for the primary platform if cross save is active', () => {
		const result = getPrimaryPlatformData([
			{ bungieGlobalDisplayName: 'Not primary', crossSaveOverride: 2, membershipType: 3 },
			{ bungieGlobalDisplayName: 'Primary platform', crossSaveOverride: 2, membershipType: 2 },
			{ bungieGlobalDisplayName: 'Also not primary', crossSaveOverride: 2, membershipType: 1 }
		]);

		expect(result).toStrictEqual({
			bungieGlobalDisplayName: 'Primary platform',
			crossSaveOverride: 2,
			membershipType: 2
		});
	});

	it('should fallback to using the first match if somehow there are multiple primary platforms', () => {
		const result = getPrimaryPlatformData([
			{ bungieGlobalDisplayName: 'Somehow  primary', crossSaveOverride: 3, membershipType: 3 },
			{ bungieGlobalDisplayName: 'Primary platform', crossSaveOverride: 2, membershipType: 2 },
			{ bungieGlobalDisplayName: 'Not primary', crossSaveOverride: 2, membershipType: 1 }
		]);

		expect(result).toStrictEqual({
			bungieGlobalDisplayName: 'Somehow  primary',
			crossSaveOverride: 3,
			membershipType: 3
		});
	});

	it('should return undefined if no matches are found', () => {
		const result = getPrimaryPlatformData([
			{ bungieGlobalDisplayName: 'Bob', crossSaveOverride: 1, membershipType: 2 }
		]);

		expect(result).toBeUndefined();
	});
});
