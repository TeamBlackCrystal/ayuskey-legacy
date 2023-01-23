import { markRaw, reactive, Ref, ref , Component, defineAsyncComponent } from 'vue';
import { apiUrl, version, locale, env, debug } from './config';
import { query } from '../../prelude/url';
import { $i } from './account';

import MkWaitingDialog from './common/views/components/from-v12/MkWaitingDialog.vue';

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
		if ($i) (data as any).i = $i.token;
		if (token !== undefined) (data as any).i = token;

		let url = endpoint.indexOf('://') > -1 ? endpoint : `${apiUrl}/${endpoint}`;

		if (anonGet && data) {
			delete data.i;
			const q = query(data);
			url = `${url}${ q ? '?' + q : q }`;
		}

		const fetchPromise = anonGet ? fetch(url, {
			method: 'GET',
			credentials: 'omit',
		}) : fetch(url, {
			method: 'POST',
			body: JSON.stringify(data),
			credentials: 'omit',
			cache: 'no-cache',
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

export function promiseDialog<T extends Promise<any>>(
	promise: T,
	onSuccess?: ((res: any) => void) | null,
	onFailure?: ((err: Error) => void) | null,
	text?: string,
): T {
	const showing = ref(true);
	const success = ref(false);

	promise.then(res => {
		if (onSuccess) {
			showing.value = false;
			onSuccess(res);
		} else {
			success.value = true;
			window.setTimeout(() => {
				showing.value = false;
			}, 1000);
		}
	}).catch(err => {
		showing.value = false;
		if (onFailure) {
			onFailure(err);
		} else {
			alert({
				type: 'error',
				text: err,
			});
		}
	});

	// NOTE: dynamic importすると挙動がおかしくなる(showingの変更が伝播しない)
	popup(MkWaitingDialog, {
		success: success,
		showing: showing,
		text: text,
	}, {}, 'closed');

	return promise;
}

let popupIdCount = 0;
export const popups = ref([]) as Ref<{
	id: any;
	component: any;
	props: Record<string, any>;
}[]>;

const zIndexes = {
	veryLow: 500000,
	low: 1000000,
	middle: 2000000,
	high: 3000000,
};
export function claimZIndex(priority: keyof typeof zIndexes = 'low'): number {
	zIndexes[priority] += 100;
	return zIndexes[priority];
}

export async function popup(component: Component, props: Record<string, any>, events = {}, disposeEvent?: string) {
	markRaw(component);

	console.log(props)

	const id = ++popupIdCount;
	const dispose = () => {
		// このsetTimeoutが無いと挙動がおかしくなる(autocompleteが閉じなくなる)。Vueのバグ？
		window.setTimeout(() => {
			popups.value = popups.value.filter(popup => popup.id !== id);
		}, 0);
	};
	const state = {
		component,
		props,
		events: disposeEvent ? {
			...events,
			[disposeEvent]: dispose,
		} : events,
		id,
	};
	console.log(state)

	popups.value.push(state);

	return {
		dispose,
	};
}

export function alert(props: {
	type?: 'error' | 'info' | 'success' | 'warning' | 'waiting' | 'question';
	title?: string | null;
	text?: string | null;
}): Promise<void> {
	return new Promise((resolve, reject) => {
		popup(defineAsyncComponent(() => import('./common/views/components/from-v12/MkDialog.vue')), props, {
			done: result => {
				resolve();
			},
		}, 'closed');
	});
}

/*
function isModule(x: any): x is typeof import('*.vue') {
	return x.default != null;
}

export function waiting() {
	return new Promise<void>((resolve, reject) => {
		const showing = ref(true);
		popup(import('@client/components/waiting-dialog.vue'), {
			success: false,
			showing: showing
		}, {
			done: () => resolve(),
		}, 'closed');
	});
}
*/
