/**
 * Admin
 */

import { createRouter, createWebHistory } from 'vue-router';

// Style
import './style.styl';

import init from '../init';
import Index from './views/index.vue';
import NotFound from '../common/views/pages/not-found.vue';

init(launch => {
	document.title = 'Admin';

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
