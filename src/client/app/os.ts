import { markRaw, reactive, ref } from '@vue/composition-api';
import { apiUrl, version, locale, env, debug } from './config';
import { query } from '../../prelude/url';

import MiOS from './mios';

export const pendingApiRequestsCount = ref(0);
let apiRequestsCount = 0; // for debug
export const apiRequests = ref([]); // for debug

export function api(endpoint: string, data: Record<string, any> = {}, token?: string | null | undefined, anonGet = false) {
	pendingApiRequestsCount.value++;

	const onFinally = () => {
		pendingApiRequestsCount.value--;
	};

	const log = debug ? reactive({
		id: ++apiRequestsCount,
		endpoint,
		req: markRaw(data),
		res: null,
		state: 'pending',
	}) : null;
	if (debug) {
		apiRequests.value.push(log);
		if (apiRequests.value.length > 128) apiRequests.value.shift();
	}

	const promise = new Promise<void>((resolve, reject) => {
		// Append a credential
		if (MiOS.store.state.i.token) (data as any).i = MiOS.store.state.i.token;
		if (token !== undefined) (data as any).i = token;

		let url = endpoint.indexOf('://') > -1 ? endpoint : `${apiUrl}/${endpoint}`;

		if (anonGet && data) {
			delete data.i;
			const q = query(data);
			url = `${url}${ q ? '?' + q : q }`;
		}

		const fetchPromise = anonGet ? fetch(url, {
				method: 'GET',
				credentials: 'omit'
			}) : fetch(url, {
			method: 'POST',
			body: JSON.stringify(data),
			credentials: 'omit',
			cache: 'no-cache'
		});

		// Send request
		fetchPromise.then(async (res) => {
			const body = res.status === 204 ? null : await res.json().catch(() => null);

			if (res.status === 200) {
				resolve(body);
				if (debug) {
					log!.res = markRaw(body);
					log!.state = 'success';
				}
			} else if (res.status === 204) {
				resolve();
				if (debug) {
					log!.state = 'success';
				}
			} else {
				reject(body ? body.error : `${res.status} ${res.statusText}`);
				if (debug) {
					log!.res = markRaw(body.error);
					log!.state = 'failed';
				}
			}
		}).catch(reject);
	});

	promise.then(onFinally, onFinally);

	return promise;
}
