import autobind from 'autobind-decorator';
import Xev from 'xev';
import Channel from '../channel';

const ev = new Xev();

export default class extends Channel {
	public readonly chName = 'serverStatsV12';
	public static shouldShare = true;
	public static requireCredential = false;

	@autobind
	public async init(params: any) {
		ev.addListener('serverStatsV12', this.onStats);
	}

	@autobind
	private onStats(stats: any) {
		this.send('stats', stats);
	}

	@autobind
	public onMessage(type: string, body: any) {
		switch (type) {
			case 'requestLog':
				ev.once(`serverStatsV12Log:${body.id}`, statsLog => {
					this.send('statsLog', statsLog);
				});
				ev.emit('requestServerStatsV12Log', {
					id: body.id,
					length: body.length
				});
				break;
		}
	}

	@autobind
	public dispose() {
		ev.removeListener('serverStatsV12', this.onStats);
	}
}
