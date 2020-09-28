import * as http from 'http';
import * as websocket from 'websocket';
import * as redis from 'redis';
import Xev from 'xev';

import MainStreamConnection from './stream';
import { ParsedUrlQuery } from 'querystring';
import authenticate from './authenticate';
import { EventEmitter } from 'events';
import config from '../../config';
import rndstr from 'rndstr';
import Logger from '../../services/logger';

export const streamLogger = new Logger('stream', 'cyan');

module.exports = (server: http.Server) => {
	// Init websocket server
	const ws = new websocket.server({
		httpServer: server
	});

	ws.on('request', async (request) => {
		const q = request.resourceURL.query as ParsedUrlQuery;
		const [user, app] = await authenticate(q.i as string);

		const connection = request.accept();

		const connHash = rndstr(8);
		const connPeer = `${connection?.remoteAddress}`;
		const connUser = user ? `${user._id} (${user.username})` : 'anonymous';
		streamLogger.info(`connect ${connHash} (${connPeer} ${connUser})`);

		let ev: EventEmitter;

		if (config.redis) {
			// Connect to Redis
			const subscriber = redis.createClient(
				config.redis.port,
				config.redis.host,
				{
					password: config.redis.pass
				}
			);

			subscriber.subscribe(config.host);

			ev = new EventEmitter();

			subscriber.on('message', async (_, data) => {
				const obj = JSON.parse(data);

				ev.emit(obj.channel, obj.message);
			});

			connection.once('close', () => {
				subscriber.unsubscribe();
				subscriber.quit();
			});
		} else {
			ev = new Xev();
		}

		const main = new MainStreamConnection(connection, ev, user, app);

		//#region 後方互換性のため
		if (request.resourceURL.pathname !== '/streaming') {
			streamLogger.warn(`404 ${request.resourceURL.pathname} ${connHash} (${connPeer} ${connUser})`);
			connection.close(404);
		}
		//#endregion 後方互換性のため

		connection.once('close', () => {
			streamLogger.info(`close ${connHash} (${connPeer} ${connUser})`);
			ev.removeAllListeners();
			main.dispose();
		});

		connection.on('message', async (data) => {
			if (data.utf8Data == 'ping') {
				connection.send('pong');
			}
		});
	});	// ws on request
};
