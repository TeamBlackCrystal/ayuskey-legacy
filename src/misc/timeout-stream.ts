import autobind from 'autobind-decorator';
import { Transform } from 'stream';

export class TimeoutStream extends Transform {
	private lastReceived: number;
	private timeout: number;
	private timer: NodeJS.Timer;
	private onTimeout: () => void;

	/**
	 * Transform stream to detect timeout
	 * @param timeout Timeout in ms
	 * @param onTimeout On timeout callback
	 */
	constructor(timeout = 10 * 1000, onTimeout: () => void) {
		super();

		this.timeout = timeout
		this.onTimeout = onTimeout;

		this.lastReceived = Date.now();
		this.timer = setInterval(this.checkTimeout, 1000);
	}

	// Impliment Transform._transform
	@autobind
	_transform(chunk: any, encoding: any, callback: any) {
		this.lastReceived = Date.now();

		this.push(chunk, encoding);
		callback();
	}

	// Impliment Transform._flush
	@autobind
	_flush(cb: any) {
		this.lastReceived = Date.now();

		cb();
	}

	@autobind
	private checkTimeout() {
		const now = Date.now();

		if (now - this.lastReceived > this.timeout) {
			this.onTimeout();
		}
	}

	@autobind
	destroy() {
		clearInterval(this.timer);
	}
}
