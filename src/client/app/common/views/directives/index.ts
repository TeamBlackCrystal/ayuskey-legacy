import { App } from 'vue';

import userPreview from './user-preview';
import autocomplete from './autocomplete';
import particle from './particle';

export default function(app: App) {
	app.directive('userPreview', userPreview);
	app.directive('user-preview', userPreview);
	app.directive('autocomplete', autocomplete);
	app.directive('particle', particle);
}
