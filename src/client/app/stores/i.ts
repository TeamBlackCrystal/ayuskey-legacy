import { User as UserDetailed } from 'ayuskey.js/built/schema';
import { defineStore } from 'pinia';

export type ClientUserDetaield = UserDetailed & {
	emailVerified?: boolean;
	bannerUrl?: string
	pendingReceivedFollowRequestsCount: number

};

export const useIStore = defineStore('i', {
	state: () => {
		return {} as ClientUserDetaield;
	},
	persist: {
		key: 'persist_i',
	},
});
