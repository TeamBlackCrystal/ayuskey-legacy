import { App } from 'vue';

import wNotifications from './notifications.vue';
import wTimemachine from './timemachine.vue';
import wActivity from './activity.vue';
import wTrends from './trends.vue';
import wUsers from './users.vue';
import wPolls from './polls.vue';
import wMessaging from './messaging.vue';
import wProfile from './profile.vue';
import wCustomize from './customize.vue';

export default function(app: App) {
	app.component('MkwNotifications', wNotifications);
	app.component('MkwTimemachine', wTimemachine);
	app.component('MkwActivity', wActivity);
	app.component('MkwTrends', wTrends);
	app.component('MkwUsers', wUsers);
	app.component('MkwPolls', wPolls);
	app.component('MkwMessaging', wMessaging);
	app.component('MkwProfile', wProfile);
	app.component('MkwCustomize', wCustomize);
}
