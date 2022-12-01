import * as Ayuskey from 'ayuskey.js';
import { ref } from 'vue';
import { $i } from './account';
import * as config from './config';
import { promiseDialog, alert } from './os';

export const api = new Ayuskey.api.APIClient({
	origin: config.url,
});

export const pendingApiRequestsCount = ref(api.pendingApiRequestsCount);

export const apiWithDialog = ((
	endpoint: string,
	options: {
		data?: Record<string, any>,
		token?: string | null | undefined,
	} = { data: {}, token: null },
) => {
	// TODO: いいかんじにしたい
	const params = options.data; 
	const i = options.token;
	const promise = api.request(endpoint, { params, i });
	promiseDialog(promise, null, (err) => {
		alert({
			type: 'error',
			text: err.message + '\n' + (err as any).id,
		});
	});

	return promise;
}) as typeof api.request;
