import Vue from 'vue';

import wNotifications from './notifications.vue';
import wTimemachine from './timemachine.vue';
import wActivity from './activity.vue';
import wTrends from './trends.vue';
import wUsers from './users.vue';
import wPolls from './polls.vue';
import wMessaging from './messaging.vue';
import wProfile from './profile.vue';
import wCustomize from './customize.vue';

Vue.component('MkwNotifications', wNotifications);
Vue.component('MkwTimemachine', wTimemachine);
Vue.component('MkwActivity', wActivity);
Vue.component('MkwTrends', wTrends);
Vue.component('MkwUsers', wUsers);
Vue.component('MkwPolls', wPolls);
Vue.component('MkwMessaging', wMessaging);
Vue.component('MkwProfile', wProfile);
Vue.component('MkwCustomize', wCustomize);
