/**
 * Authorize Form
 */

import { createRouter, createWebHistory } from 'vue-router';

// Style
import './style.styl';

import init from '../init';
import Index from './views/index.vue';
import NotFound from '../common/views/pages/not-found.vue';

/**
 * init
 */
init(launch => {
	// Init router
	const router = createRouter({
		history: createWebHistory('/auth/'),
		routes: [
			{ path: '/:token', component: Index },
			{ path: '/:pathMatch(.*)*', component: NotFound },
		],
	});

	// Launch the app
	launch(router);
});
