/**
 * Deprecated!!
 * Developer Center
 */

import Vue from 'vue';
import { createRouter, createWebHistory } from 'vue-router';
import BootstrapVue from 'bootstrap-vue';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap-vue/dist/bootstrap-vue.css';

// Style
import './style.styl';

import init from '../init';

import Index from './views/index.vue';
import Apps from './views/apps.vue';
import AppNew from './views/new-app.vue';
import App from './views/app.vue';
import ui from './views/ui.vue';
import NotFound from '../common/views/pages/not-found.vue';

Vue.use(BootstrapVue);

Vue.component('MkUi', ui);

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
	launch(router);
});
