import { App } from 'vue';

import wAnalogClock from './analog-clock.vue';
import wVersion from './version.vue';
import wRss from './rss.vue';
import wServer from './server.vue';
import wPostsMonitor from './posts-monitor.vue';
import wMemo from './memo.vue';
import wBroadcast from './broadcast.vue';
import wCalendar from './calendar.vue';
import wPhotoStream from './photo-stream.vue';
import wSlideshow from './slideshow.vue';
import wTips from './tips.vue';
import wNav from './nav.vue';
import wHashtags from './hashtags.vue';
import wInstance from './instance.vue';
import wPostForm from './post-form.vue';

export default function(app: App) {
	app.component('MkwAnalogClock', wAnalogClock);
	app.component('MkwNav', wNav);
	app.component('MkwCalendar', wCalendar);
	app.component('MkwPhotoStream', wPhotoStream);
	app.component('MkwSlideshow', wSlideshow);
	app.component('MkwTips', wTips);
	app.component('MkwBroadcast', wBroadcast);
	app.component('MkwServer', wServer);
	app.component('MkwPostsMonitor', wPostsMonitor);
	app.component('MkwMemo', wMemo);
	app.component('MkwRss', wRss);
	app.component('MkwVersion', wVersion);
	app.component('MkwHashtags', wHashtags);
	app.component('MkwInstance', wInstance);
	app.component('MkwPostForm', wPostForm);
	app.component('MkwQueue', () => import('./queue.vue').then(m => m.default));
	app.component('MkwJobQueue', () => import('./job-queue.vue').then(m => m.default));
	app.component('MkwAichan', () => import('./aichan.vue').then(m => m.default));
}
