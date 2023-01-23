/**
 * Admin
 */

import { configureCompat } from 'vue'
import { createRouter, createWebHistory } from 'vue-router';

// Style
import './style.styl';

import init from '../init';
import Index from './views/index.vue';
import NotFound from '../common/views/pages/not-found.vue';

init(launch => {
	document.title = 'Admin';

	configureCompat({
		MODE: 2,
		GLOBAL_MOUNT: true,
		GLOBAL_PROTOTYPE: true,
		OPTIONS_DATA_FN: true,
		OPTIONS_BEFORE_DESTROY: true,
		INSTANCE_EVENT_HOOKS: true,
	});

	// Init router
	const router = createRouter({
		history: createWebHistory('/admin/'),
		routes: [
			{ path: '/:page', component: Index },
			{ path: '/', redirect: '/dashboard' },
			{ path: '/:pathMatch(.*)*', component: NotFound },
		],
	});

	// Launch the app
	launch(router);
});
