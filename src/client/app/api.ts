import * as Ayuskey from 'ayuskey.js';
import { $i } from './account';
import * as config from './config';

export const api = new Ayuskey.api.APIClient({
	origin: config.url,
	credential: $i.token
})
