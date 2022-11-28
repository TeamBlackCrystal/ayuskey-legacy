import { App } from 'vue';

import autocomplete from './autocomplete';
import particle from './particle';

export default function(app: App) {
	app.directive('autocomplete', autocomplete);
	app.directive('particle', particle);
}
