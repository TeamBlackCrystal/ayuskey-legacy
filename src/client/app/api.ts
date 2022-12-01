import * as Ayuskey from 'ayuskey.js';
import { ref } from 'vue';
import * as config from './config';

export const api = new Ayuskey.api.APIClient({
	origin: config.url,
})

export const pendingApiRequestsCount = ref(api.pendingApiRequestsCount)
