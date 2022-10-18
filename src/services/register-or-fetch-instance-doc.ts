import { Instance } from '@ayuskey/models';
import { Instances } from '../models';
import { federationChart } from './chart';
import { genId } from '@ayuskey/shared';
import { toPuny } from '../misc/convert-host';

export async function registerOrFetchInstanceDoc(host: string): Promise<Instance> {
	host = toPuny(host);

	const index = await Instances.findOne({ host });

	if (index == null) {
		const i = await Instances.save({
			id: genId(),
			host,
			caughtAt: new Date(),
			lastCommunicatedAt: new Date(),
		});

		federationChart.update(true);

		return i;
	} else {
		return index;
	}
}
