/**
 * Deprecated!!
 * Developer Center
 */

import { createRouter, createWebHistory } from 'vue-router';
import BootstrapVue3 from 'bootstrap-vue-3';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap-vue-3/dist/bootstrap-vue-3.css';

// Style
import './style.styl';

import init from '../init';

import Index from './views/index.vue';
import Apps from './views/apps.vue';
import AppNew from './views/new-app.vue';
import App from './views/app.vue';
import ui from './views/ui.vue';
import NotFound from '../common/views/pages/not-found.vue';

/**
 * init
 */
init(launch => {
	// Init router
	const router = createRouter({
		history: createWebHistory('/dev/'),
		routes: [
			{ path: '/', component: Index },
			{ path: '/apps', component: Apps },
			{ path: '/app/new', component: AppNew },
			{ path: '/app/:id', component: App },
			{ path: '/:pathMatch(.*)*', component: NotFound },
		],
	});

	// Launch the app
	const [app, _] = launch(router);

	app.use(BootstrapVue3);
	app.component('MkUi', ui);
});
