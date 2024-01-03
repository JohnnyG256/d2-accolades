import type { components } from '$lib/bungie/api';

export type ManifestRecord =
	components['schemas']['Destiny.Definitions.Records.DestinyRecordDefinition'];

export type PlayerRecord =
	components['schemas']['Destiny.Components.Records.DestinyRecordComponent'];

export type SealInfo = {
	name: string;
	icon: string;
	completed: boolean;
	timesGilded?: number;
};

const repeatSeals: Record<number, number> = {
	2226626398: 10,
	2980266417: 11,
	4167244320: 12,
	2072890963: 10,
	2284880502: 11,
	2126548397: 12
};

export class Seal {
	hash;
	gildedHash;
	private name;
	private icon;

	private constructor(manifestEntry: ManifestRecord, gildedEntry?: ManifestRecord) {
		const hash = manifestEntry.hash;

		if (hash === undefined) {
			throw Error;
		}

		const rawName = manifestEntry.titleInfo?.titlesByGender?.Male ?? '';
		let name;
		let gildedHash;
		if (repeatSeals[hash] === undefined) {
			name = rawName
			gildedHash = gildedEntry?.hash
		} else {
			name = `${rawName} (Season ${repeatSeals[hash]})`
			gildedHash = undefined
		}


		this.hash = hash;
		this.gildedHash = gildedHash
		this.name = name
		this.icon = manifestEntry.displayProperties?.icon ?? '';
	}

	static fromManifest(manifestData: Record<number, ManifestRecord>) {
		const normalSeals = Object.values(manifestData).filter(
			(record) => record.titleInfo?.hasTitle && !record.forTitleGilding
		);
		const gildedSeals = Object.values(manifestData).filter((record) => record.forTitleGilding);

		return normalSeals.map((seal) => {
			const gilded = gildedSeals.find(
				(gildedSeal) =>
					gildedSeal.titleInfo?.titlesByGender?.Male === seal.titleInfo?.titlesByGender?.Male
			);

			if (gilded) {
				return new Seal(seal, gilded);
			}

			return new Seal(seal);
		});
	}

	getInfo(playerRecords: Record<number, PlayerRecord>): SealInfo {
		const state = playerRecords?.[this.hash]?.state ?? 0;
		const completed = !!(state & 64);

		const timesGilded =
			this.gildedHash === undefined
				? undefined
				: playerRecords[this.gildedHash]?.completedCount ?? 0;

		return {
			name: this.name,
			icon: this.icon,
			completed,
			timesGilded
		};
	}
}
