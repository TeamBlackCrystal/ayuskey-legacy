const interval = 30 * 60 * 1000;
import { AttestationChallenges } from '../models';
import { LessThan } from 'typeorm';

/**
 * Clean up database occasionally
 */
export default function() {
	async function tick() {
		await AttestationChallenges.delete({
			createdAt: LessThan(new Date(new Date().getTime() - 5 * 60 * 1000)),
		});
	}

	tick();

	setInterval(tick, interval);
}
