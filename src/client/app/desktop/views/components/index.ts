import { App } from 'vue';

import ui from './ui.vue';
import uiNotification from './ui-notification.vue';
import note from './note.vue';
import notes from './notes.vue';
import subNoteContent from './sub-note-content.vue';
import window from './window.vue';
import renoteFormWindow from './renote-form-window.vue';
import mediaVideo from './media-video.vue';
import notifications from './notifications.vue';
import renoteForm from './renote-form.vue';
import notePreview from './note-preview.vue';
import noteDetail from './note-detail.vue';
import calendar from './calendar.vue';
import activity from './activity.vue';
import userListTimeline from './user-list-timeline.vue';
import uiContainer from './ui-container.vue';

export default function(app: App) {
	app.component('MkUi', ui);
	app.component('MkUiNotification', uiNotification);
	app.component('MkNote', note);
	app.component('MkNotes', notes);
	app.component('MkSubNoteContent', subNoteContent);
	app.component('MkWindow', window);
	app.component('MkRenoteFormWindow', renoteFormWindow);
	app.component('MkMediaVideo', mediaVideo);
	app.component('MkNotifications', notifications);
	app.component('MkRenoteForm', renoteForm);
	app.component('MkNotePreview', notePreview);
	app.component('MkNoteDetail', noteDetail);
	app.component('MkCalendar', calendar);
	app.component('MkActivity', activity);
	app.component('MkUserListTimeline', userListTimeline);
	app.component('UiContainer', uiContainer);
}
