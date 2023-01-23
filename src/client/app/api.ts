import * as Ayuskey from 'ayuskey.js';
import { ref } from 'vue';
import { $i, $token } from './account';
import * as config from './config';
import { promiseDialog, alert } from './os';
import { apiClient } from 'strictcat';
import { Schema } from './api.schema';

export const betaApi = apiClient<Schema>(`${config.url}/api`, { contentType: 'application/json', sharedBody: { i: $token } });

export const ayuskeyApi = Ayuskey.api.ayuskeyClient({
	origin: `${config.url}/api`,
	i: $token,
});

export const api = new Ayuskey.api.APIClient({
	origin: config.url,
});

export const pendingApiRequestsCount = ref(api.pendingApiRequestsCount);

export const apiWithDialog = ((
	endpoint: string,
	options: {
		data?: Record<string, any>;
		token?: string | null | undefined;
	} = { data: {}, token: null },
) => {
	// TODO: いいかんじにしたい
	const params = options.data;
	const i = options.token;
	// eslint-disable-next-line @typescript-eslint/ban-ts-comment
	// @ts-ignore
	const promise = api.request(endpoint, { params, i });
	promiseDialog(promise, null, (err) => {
		alert({
			type: 'error',
			text: err.message + '\n' + (err as any).id,
		});
	});

	return promise;
}) as typeof api.request;
