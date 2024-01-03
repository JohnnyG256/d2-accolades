import { describe, expect, it } from 'vitest';
import { Seal } from './seal';

describe('fromManifest', () => {
	it('should return a list of seals given raw manifest entries', () => {
		const result = Seal.fromManifest({
			0: { titleInfo: { hasTitle: true }, hash: 0 },
			10: { titleInfo: { hasTitle: true }, hash: 10 }
		});

		const title1 = result.find((title) => title.hash === 0);
		const title10 = result.find((title) => title.hash === 10);

		expect(result.length).toBe(2);
		expect(title1).toBeDefined();
		expect(title10).toBeDefined();
	});

	it('should ignore manifest entries that do not refer to seals', () => {
		const result = Seal.fromManifest({
			1: { titleInfo: { hasTitle: true }, hash: 1 },
			2: { titleInfo: { hasTitle: false }, hash: 2 },
			3: { titleInfo: { hasTitle: true }, hash: 3 },
			4: { hash: 4 }
		});

		const title1 = result.find((title) => title.hash === 1);
		const title3 = result.find((title) => title.hash === 3);

		expect(result.length).toBe(2);
		expect(title1).toBeDefined();
		expect(title3).toBeDefined();
	});

	it('should handle gilded seals properly', () => {
		const result = Seal.fromManifest({
			0: {
				titleInfo: { hasTitle: true, titlesByGender: { Male: 'GildedTitle' } },
				forTitleGilding: true,
				hash: 0
			},
			1: { titleInfo: { hasTitle: true, titlesByGender: { Male: 'NormalTitle' } }, hash: 1 },
			2: { titleInfo: { hasTitle: true, titlesByGender: { Male: 'GildedTitle' } }, hash: 2 }
		});

		const normalTitle = result.find((title) => title.hash === 1);
		const gildedTitle = result.find((title) => title.hash === 2);

		expect(result.length).toBe(2);
		expect(normalTitle).toBeDefined();
		expect(normalTitle?.gildedHash).toBeUndefined();
		expect(gildedTitle?.gildedHash).toBe(0);
	});
});

describe('getInfo', () => {
	const [normalSeal, gildedSeal] = Seal.fromManifest({
		1: {
			titleInfo: { hasTitle: true, titlesByGender: { Male: 'Normal Seal' } },
			hash: 1,
			displayProperties: { icon: 'icon1' }
		},
		2: {
			titleInfo: { hasTitle: true, titlesByGender: { Male: 'Gilded Seal' } },
			hash: 2,
			displayProperties: { icon: 'icon2' }
		},
		3: {
			titleInfo: { hasTitle: true, titlesByGender: { Male: 'Gilded Seal' } },
			hash: 3,
			forTitleGilding: true
		}
	});

	it('should return correct info for seals', () => {
		const normalResult = normalSeal.getInfo({10: {state: 64}});
    expect(normalResult).toStrictEqual({
      name: "Normal Seal",
      icon: "icon1",
      completed: false,
      timesGilded: undefined
    })

    const gildedResult = gildedSeal.getInfo({});
    expect(gildedResult).toStrictEqual({
      name: "Gilded Seal",
      icon: "icon2",
      completed: false,
      timesGilded: 0
    })
	});

  it("should return proper result if player has completed seal", () => {
    const result = normalSeal.getInfo({1: {state: 67}})
    expect(result).toStrictEqual({
      name: "Normal Seal",
      icon: "icon1",
      completed: true,
      timesGilded: undefined
    })

  })
});
