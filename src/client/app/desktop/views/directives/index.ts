import { App } from 'vue';

import userPreview from './user-preview';

export default function(app: App) {
	app.directive('userPreview', userPreview);
	app.directive('user-preview', userPreview);
}
