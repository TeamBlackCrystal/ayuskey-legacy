/**
 * Desktop Client
 */

import Vue, { App } from 'vue';
import VueRouter, { createRouter, createWebHistory } from 'vue-router';

// Style
import './style.styl';
import './style.scss';

import init from '../init';
import composeNotification from '../sw/compose-notification';

import MkHome from './views/home/home.vue';
import MkSelectDrive from './views/pages/selectdrive.vue';
import MkDrive from './views/pages/drive.vue';
import MkMessagingRoom from './views/pages/messaging-room.vue';
import MkReversi from './views/pages/games/reversi.vue';
import MkShare from '../common/views/pages/share.vue';
import MkFollow from '../common/views/pages/follow.vue';
import MkResetPassword from '../common/views/pages/reset-password.vue';
import MkNotFound from '../common/views/pages/not-found.vue';
import MkSettings from './views/pages/settings.vue';
import DeckColumn from '../common/views/deck/deck.column-template.vue';

import Ctx from './views/components/context-menu.vue';
import RenoteFormWindow from './views/components/renote-form-window.vue';
import MkChooseFileFromDriveWindow from './views/components/choose-file-from-drive-window.vue';
import MkChooseFolderFromDriveWindow from './views/components/choose-folder-from-drive-window.vue';
import MkHomeTimeline from './views/home/timeline.vue';
import Notification from './views/components/ui-notification.vue';

import desktopDirectives from './views/directives';
import desktopComponents from './views/components';
import desktopWidgets from './views/widgets';

import { url } from '../config';
import MiOS from '../mios';

/**
 * init
 */
init(async (launch, os) => {
	function desktopMixin(app: App) {
		app.mixin({
			methods: {
				$contextmenu(e, menu, opts?) {
					const o = opts || {};
					const vm = this.$root.new(Ctx, {
						menu,
						x: e.pageX - window.pageXOffset,
						y: e.pageY - window.pageYOffset,
					});
					vm.$once('closed', () => {
						if (o.closed) o.closed();
					});
				},

				$post(opts) {
					const o = opts || {};
					if (o.renote) {
						const vm = this.$root.new(RenoteFormWindow, {
							note: o.renote,
							animation: o.animation == null ? true : o.animation,
						});
						if (o.cb) vm.$once('closed', o.cb);
					} else {
						this.$root.newAsync(() => import('./views/components/post-form-window.vue').then(m => m.default), {
							reply: o.reply,
							airReply: o.airReply,
							mention: o.mention,
							animation: o.animation == null ? true : o.animation,
							initialText: o.initialText,
							instant: o.instant,
							initialNote: o.initialNote,
						}).then(vm => {
							if (o.cb) vm.$once('closed', o.cb);
						});
					}
				},

				$chooseDriveFile(opts) {
					return new Promise((res, rej) => {
						const o = opts || {};

						if (document.body.clientWidth > 800) {
							const w = this.$root.new(MkChooseFileFromDriveWindow, {
								title: o.title,
								type: o.type,
								multiple: o.multiple,
								initFolder: o.currentFolder,
							});
							w.$once('selected', file => {
								res(file);
							});
						} else {
							window['cb'] = file => {
								res(file);
							};

							window.open(url + `/selectdrive?multiple=${o.multiple}`,
								'choose_drive_window',
								'height=500, width=800');
						}
					});
				},

				$chooseDriveFolder(opts) {
					return new Promise((res, rej) => {
						const o = opts || {};
						const w = this.$root.new(MkChooseFolderFromDriveWindow, {
							title: o.title,
							initFolder: o.currentFolder,
						});
						w.$once('selected', folder => {
							res(folder);
						});
					});
				},

				$notify(message) {
					this.$root.new(Notification, {
						message,
					});
				},
			},
		});
	}

	// Init router
	const router = createRouter({
		history: createWebHistory(),
		routes: [
			os.store.state.device.inDeckMode
				? { path: '/', name: 'index', component: () => import('../common/views/deck/deck.vue').then(m => m.default), children: [
					{ path: '/@:user', component: () => import('../common/views/deck/deck.user-column.vue').then(m => m.default), children: [
						{ path: '', name: 'user', component: () => import('../common/views/deck/deck.user-column.home.vue').then(m => m.default) },
						{ path: 'following', component: () => import('../common/views/pages/following.vue').then(m => m.default) },
						{ path: 'followers', component: () => import('../common/views/pages/followers.vue').then(m => m.default) },
					] },
					{ path: '/notes/:note', name: 'note', component: () => import('../common/views/deck/deck.note-column.vue').then(m => m.default) },
					{ path: '/search', component: () => import('../common/views/deck/deck.search-column.vue').then(m => m.default) },
					{ path: '/tags/:tag', name: 'tag', component: () => import('../common/views/deck/deck.hashtag-column.vue').then(m => m.default) },
					{ path: '/featured', name: 'featured', component: DeckColumn, props: route => ({ component: () => import('../common/views/pages/featured.vue').then(m => m.default), platform: 'deck' }) },
					{ path: '/explore', name: 'explore', component: DeckColumn, props: route => ({ component: () => import('../common/views/pages/explore.vue').then(m => m.default) }) },
					{ path: '/explore/tags/:tag', name: 'explore-tag', component: DeckColumn, props: route => ({ component: () => import('../common/views/pages/explore.vue').then(m => m.default), tag: route.params.tag }) },
					{ path: '/about', name: 'about', component: DeckColumn, props: route => ({ component: () => import('../common/views/deck/deck.about-column.vue').then(m => m.default) }) },
					{ path: '/i/favorites', component: DeckColumn, props: route => ({ component: () => import('../common/views/pages/favorites.vue').then(m => m.default), platform: 'deck' }) },
					{ path: '/i/pages', component: DeckColumn, props: route => ({ component: () => import('../common/views/pages/pages.vue').then(m => m.default) }) },
					{ path: '/i/lists', component: DeckColumn, props: route => ({ component: () => import('../common/views/pages/user-lists.vue').then(m => m.default) }) },
					{ path: '/i/lists/:listId', component: DeckColumn, props: route => ({ component: () => import('../common/views/pages/user-list-editor.vue').then(m => m.default), listId: route.params.listId }) },
					{ path: '/i/groups', component: DeckColumn, props: route => ({ component: () => import('../common/views/pages/user-groups.vue').then(m => m.default) }) },
					{ path: '/i/groups/:groupId', component: DeckColumn, props: route => ({ component: () => import('../common/views/pages/user-group-editor.vue').then(m => m.default), groupId: route.params.groupId }) },
					{ path: '/i/follow-requests', component: DeckColumn, props: route => ({ component: () => import('../common/views/pages/follow-requests.vue').then(m => m.default) }) },
					{ path: '/@:username/pages/:pageName', name: 'page', props: true, component: () => import('../common/views/deck/deck.page-column.vue').then(m => m.default) },
				] }
				: { path: '/', component: MkHome, children: [
					{ path: '', name: 'index', component: MkHomeTimeline },
					{ path: '/@:user', component: () => import('./views/home/user/index.vue').then(m => m.default), children: [
						{ path: '', name: 'user', component: () => import('./views/home/user/user.home.vue').then(m => m.default) },
						{ path: 'following', component: () => import('../common/views/pages/following.vue').then(m => m.default) },
						{ path: 'followers', component: () => import('../common/views/pages/followers.vue').then(m => m.default) },
					] },
					{ path: '/notes/:note', name: 'note', component: () => import('./views/home/note.vue').then(m => m.default) },
					{ path: '/search', component: () => import('./views/home/search.vue').then(m => m.default) },
					{ path: '/tags/:tag', name: 'tag', component: () => import('./views/home/tag.vue').then(m => m.default) },
					{ path: '/featured', name: 'featured', component: () => import('../common/views/pages/featured.vue').then(m => m.default), props: { platform: 'desktop' } },
					{ path: '/explore', name: 'explore', component: () => import('../common/views/pages/explore.vue').then(m => m.default) },
					{ path: '/explore/tags/:tag', name: 'explore-tag', props: true, component: () => import('../common/views/pages/explore.vue').then(m => m.default) },
					{ path: '/i/favorites', component: () => import('../common/views/pages/favorites.vue').then(m => m.default), props: { platform: 'desktop' } },
					{ path: '/about', name: 'about', component: () => import('../common/views/pages/about.vue').then(m => m.default) },
					{ path: '/i/pages', component: () => import('../common/views/pages/pages.vue').then(m => m.default) },
					{ path: '/i/lists', component: () => import('../common/views/pages/user-lists.vue').then(m => m.default) },
					{ path: '/i/lists/:listId', props: true, component: () => import('../common/views/pages/user-list-editor.vue').then(m => m.default) },
					{ path: '/i/groups', component: () => import('../common/views/pages/user-groups.vue').then(m => m.default) },
					{ path: '/i/groups/:groupId', props: true, component: () => import('../common/views/pages/user-group-editor.vue').then(m => m.default) },
					{ path: '/i/follow-requests', component: () => import('../common/views/pages/follow-requests.vue').then(m => m.default) },
					{ path: '/i/pages/new', component: () => import('../common/views/pages/page-editor/page-editor.vue').then(m => m.default) },
					{ path: '/i/pages/edit/:pageId', component: () => import('../common/views/pages/page-editor/page-editor.vue').then(m => m.default), props: route => ({ initPageId: route.params.pageId }) },
					{ path: '/@:user/pages/:page', component: () => import('../common/views/pages/page.vue').then(m => m.default), props: route => ({ pageName: route.params.page, username: route.params.user }) },
					{ path: '/@:user/pages/:pageName/view-source', component: () => import('../common/views/pages/page-editor/page-editor.vue').then(m => m.default), props: route => ({ initUser: route.params.user, initPageName: route.params.pageName }) },
				] },
			{ path: '/i/pages/new', component: () => import('../common/views/pages/page-editor/page-editor.vue').then(m => m.default) },
			{ path: '/i/pages/edit/:pageId', component: () => import('../common/views/pages/page-editor/page-editor.vue').then(m => m.default), props: route => ({ initPageId: route.params.pageId }) },
			{ path: '/@:user/pages/:pageName/view-source', component: () => import('../common/views/pages/page-editor/page-editor.vue').then(m => m.default), props: route => ({ initUser: route.params.user, initPageName: route.params.pageName }) },
			{ path: '/i/messaging/group/:group', component: MkMessagingRoom },
			{ path: '/i/messaging/:user', component: MkMessagingRoom },
			{ path: '/i/drive', component: MkDrive },
			{ path: '/i/drive/folder/:folder', component: MkDrive },
			{ path: '/i/settings', redirect: '/i/settings/profile' },
			{ path: '/i/settings/:page', component: MkSettings },
			{ path: '/selectdrive', component: MkSelectDrive },
			{ path: '/@:acct/room', props: true, component: () => import('../common/views/pages/room/room.vue').then(m => m.default) },
			{ path: '/share', component: MkShare },
			{ path: '/games/reversi/:game?', component: MkReversi },
			{ path: '/authorize-follow', component: MkFollow },
			{ path: '/reset-password/:token', component: MkResetPassword, props: true },
			{ path: '/deck', redirect: '/' },
			{ path: '/flags', component: () => import('../common/views/pages/flags.vue').then(m => m.default) },
			{ path: '/:pathMatch(.*)*', component: MkNotFound },
		],
		scrollBehavior(to, from, savedPosition) {
			return { left: 0, top: 0 };
		},
	});

	// Launch the app
	const [app, _] = launch(router);

	desktopMixin(app);

	// Register directives
	desktopDirectives(app);

	// Register components
	desktopComponents(app);
	desktopWidgets(app);

	/**
	 * Init Notification
	 */
	if ('Notification' in window && os.store.getters.isSignedIn) {
		// 許可を得ていなかったらリクエスト
		if ((Notification as any).permission == 'default') {
			await Notification.requestPermission();
		}

		if ((Notification as any).permission == 'granted') {
			registerNotifications(os);
		}
	}
}, true);

function registerNotifications(os: MiOS) {
	const stream = os.stream;

	if (stream == null) return;

	const connection = stream.useSharedConnection('main');

	connection.on('notification', notification => {
		const _n = composeNotification('notification', notification);
		const n = new Notification(_n.title, {
			body: _n.body,
			icon: _n.icon,
		});
		setTimeout(n.close.bind(n), 6000);
	});

	connection.on('driveFileCreated', file => {
		const _n = composeNotification('driveFileCreated', file);
		const n = new Notification(_n.title, {
			body: _n.body,
			icon: _n.icon,
		});
		setTimeout(n.close.bind(n), 5000);
	});

	connection.on('unreadMessagingMessage', message => {
		const _n = composeNotification('unreadMessagingMessage', message);
		const n = new Notification(_n.title, {
			body: _n.body,
			icon: _n.icon,
		});
		n.onclick = () => {
			n.close();
			/*(riot as any).mount(document.body.appendChild(document.createElement('mk-messaging-room-window')), {
				user: message.user
			});*/
		};
		setTimeout(n.close.bind(n), 7000);
	});

	connection.on('reversiInvited', matching => {
		const _n = composeNotification('reversiInvited', matching);
		const n = new Notification(_n.title, {
			body: _n.body,
			icon: _n.icon,
		});
	});
}
