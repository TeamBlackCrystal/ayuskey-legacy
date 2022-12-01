import * as Ayuskey from 'ayuskey.js';
import { ref } from 'vue';
import { $i } from './account';
import * as config from './config';
import { promiseDialog, alert } from './os';

export const pendingApiRequestsCount = ref(0);

export const apiClient = new Ayuskey.api.APIClient({
	origin: config.url,
	//credential: $i.token,
});

export const api = ((endpoint: string, data: Record<string, any> = {}, token?: string | null | undefined) => {
	pendingApiRequestsCount.value++;

	const onFinally = () => {
		pendingApiRequestsCount.value--;
	};

	const promise = new Promise((resolve, reject) => {
		// Append a credential
		if ($i) (data as any).i = $i.token;
		if (token !== undefined) (data as any).i = token;

		// Send request
		fetch(endpoint.indexOf('://') > -1 ? endpoint : `${config.apiUrl}/${endpoint}`, {
			method: 'POST',
			body: JSON.stringify(data),
			credentials: 'omit',
			cache: 'no-cache',
		}).then(async (res) => {
			const body = res.status === 204 ? null : await res.json();

			if (res.status === 200) {
				resolve(body);
			} else if (res.status === 204) {
				resolve(null);
			} else {
				reject(body.error);
			}
		}).catch(reject);
	});

	promise.then(onFinally, onFinally);

	return promise;
}) as typeof apiClient.request;

export const apiWithDialog = ((
	endpoint: string,
	data: Record<string, any> = {},
	token?: string | null | undefined,
) => {
	const promise = api(endpoint, data, token);
	promiseDialog(promise, null, (err) => {
		alert({
			type: 'error',
			text: err.message + '\n' + (err as any).id,
		});
	});

	return promise;
}) as typeof api;
