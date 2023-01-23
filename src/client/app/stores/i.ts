import { defineStore } from 'pinia';
import { Me } from '../api.schema';

export type ClientUserDetaield = Me & {
	lang: string
};

export const useIStore = defineStore('i', {
	state: () => {
		return {} as ClientUserDetaield;
	},
	persist: {
		key: 'persist_i',
	},
});
