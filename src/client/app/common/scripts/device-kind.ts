//import { defaultStore } from '@/store';

import { useStore } from "vuex";

const store = useStore();

const ua = navigator.userAgent.toLowerCase();
const isTablet = /ipad/.test(ua) || (/mobile|iphone|android/.test(ua) && window.innerWidth > 700);
const isSmartphone = !isTablet && /mobile|iphone|android/.test(ua);
/*
export const deviceKind = store.state.device.appTypeForce ? store.state.device.appTypeForce
	: isSmartphone ? 'smartphone'
	: isTablet ? 'tablet'
	: 'desktop';
*/

export const deviceKind = isSmartphone ? 'smartphone'
	: isTablet ? 'tablet'
	: 'desktop';
