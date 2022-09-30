import { markRaw, reactive, Ref, ref , Component } from 'vue';
import * as Ayuskey from 'ayuskey.js';
import { v4 as uuid } from 'uuid';
import { apiUrl, version, locale, env, debug, url } from './config';
import { query } from '../../prelude/url';
import { $i } from './account';
import type { Endpoints } from 'ayuskey.js';

export const pendingApiRequestsCount = ref(0);
let apiRequestsCount = 0; // for debug
export const apiRequests = ref([]); // for debug

//#region api requests
let spinner = null;
let pending = 0;

// eslint-disable-next-line prefer-const
let requests = [];
//#endregion

const apiClient = new Ayuskey.api.APIClient({
	origin: url,
});

type IsNeverType<T> = [T] extends [never] ? true : false;

type StrictExtract<Union, Cond> = Cond extends Union ? Union : never;

type IsCaseMatched<E extends keyof Endpoints, P extends Endpoints[E]['req'], C extends number> =
	IsNeverType<StrictExtract<Endpoints[E]['res']['$switch']['$cases'][C], [P, any]>> extends false ? true : false;

type GetCaseResult<E extends keyof Endpoints, P extends Endpoints[E]['req'], C extends number> =
	StrictExtract<Endpoints[E]['res']['$switch']['$cases'][C], [P, any]>[1];

/**
 * Misskey APIにリクエストします
 * @param endpoint エンドポイント名
 * @param data パラメータ
 * @param silent spinnerを表示しないか
 * @param anonGet 匿名GETしてキャッシュ対象にするか
 */
export const api = (<E extends keyof Endpoints, P extends Endpoints[E]['req']>(endpoint: E, data: P = {} as P, silent = false, anonGet = false): Promise<
	Endpoints[E]['res'] extends { $switch: { $cases: [any, any][]; $default: any; }; }
?
	IsCaseMatched<E, P, 0> extends true ? GetCaseResult<E, P, 0> :
	IsCaseMatched<E, P, 1> extends true ? GetCaseResult<E, P, 1> :
	IsCaseMatched<E, P, 2> extends true ? GetCaseResult<E, P, 2> :
	IsCaseMatched<E, P, 3> extends true ? GetCaseResult<E, P, 3> :
	IsCaseMatched<E, P, 4> extends true ? GetCaseResult<E, P, 4> :
	IsCaseMatched<E, P, 5> extends true ? GetCaseResult<E, P, 5> :
	IsCaseMatched<E, P, 6> extends true ? GetCaseResult<E, P, 6> :
	IsCaseMatched<E, P, 7> extends true ? GetCaseResult<E, P, 7> :
	IsCaseMatched<E, P, 8> extends true ? GetCaseResult<E, P, 8> :
	IsCaseMatched<E, P, 9> extends true ? GetCaseResult<E, P, 9> :
	Endpoints[E]['res']['$switch']['$default']
: Endpoints[E]['res']> => {
	if (!silent) {
		if (++pending === 1) {
			spinner = document.createElement('div');
			spinner.setAttribute('id', 'wait');
			document.body.appendChild(spinner);
		}
	}

	const onFinally = () => {
		if (!silent) {
			if (--pending === 0) spinner.parentNode.removeChild(spinner);
		}
	};

	const promise = new Promise((resolve, reject) => {
		// Append a credential
		if ($i) (data as any).i = $i.token;

		const req = {
			id: uuid(),
			date: new Date(),
			name: endpoint,
			data,
			res: null,
			status: null,
		};

		if (debug) {
			requests.push(req);
		}

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
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(data),
			credentials: endpoint === 'signin' ? 'include' : 'omit',
			cache: 'no-cache',
		});

		// Send request
		fetchPromise.then(async (res) => {
			const body = res.status === 204 ? null : await res.json().catch(() => null);

			if (debug) {
				req.status = res.status;
				req.res = body;
			}

			if (res.status === 200) {
				resolve(body);
			} else if (res.status === 204) {
				resolve(null);
			} else {
				reject(body ? body.error : `${res.status} ${res.statusText}`);
			}
		}).catch(reject);
	});

	promise.then(onFinally, onFinally);

	return promise;
});

export const apiV12 = ((endpoint: string, data: Record<string, any> = {}, token?: string | null | undefined, anonGet = false) => {
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

	const promise = new Promise((resolve, reject) => {
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
				resolve(null);
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
}) as typeof apiClient.request;

/*
function isModule(x: any): x is typeof import('*.vue') {
	return x.default != null;
}

let popupIdCount = 0;
export const popups = ref([]) as Ref<{
	id: any;
	component: any;
	props: Record<string, any>;
}[]>;

export async function popup(component: Component | typeof import('*.vue') | Promise<Component | typeof import('*.vue')>, props: Record<string, any>, events = {}, disposeEvent?: string) {
	if (component.then) component = await component;

	if (isModule(component)) component = component.default;
	markRaw(component);

	const id = ++popupIdCount;
	const dispose = () => {
		//if (_DEV_) console.log('os:popup close', id, component, props, events);
		// このsetTimeoutが無いと挙動がおかしくなる(autocompleteが閉じなくなる)。Vueのバグ？
		setTimeout(() => {
			popups.value = popups.value.filter(popup => popup.id !== id);
		}, 0);
	};
	const state = {
		component,
		props,
		events: disposeEvent ? {
			...events,
			[disposeEvent]: dispose
		} : events,
		id,
	};

	//if (_DEV_) console.log('os:popup open', id, component, props, events);
	popups.value.push(state);

	return {
		dispose,
	};
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
