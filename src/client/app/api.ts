import * as Ayuskey from 'ayuskey.js';
import { ref } from 'vue';
import { $i } from './account';
import * as config from './config';
import { promiseDialog, alert } from './os';

export const api = new Ayuskey.api.APIClient({
	origin: config.url,
});

export const pendingApiRequestsCount = ref(api.pendingApiRequestsCount);
