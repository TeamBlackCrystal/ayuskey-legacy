import * as Ayuskey from 'ayuskey.js';
import { markRaw } from 'vue';
import { $i } from './account';
import { url } from './config';

export const stream = markRaw(new Ayuskey.Stream(url, $i ? {
	token: $i.token,
} : null));
