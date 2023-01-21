/**
 * App initializer
 */

import Vue, { App, createApp, h } from 'vue';
import { Router } from 'vue-router';
import VAnimateCss from 'v-animate-css';
import VModal from 'vue-js-modal';
import VueI18n from 'vue-i18n';
import SequentialEntrance from 'vue-sequential-entrance';
import * as hljs from 'highlight.js';
import 'highlight.js/styles/monokai.css';

import VueHotkey from './common/hotkey';
import VueSize from './common/size';
import AppBase from './app.vue';
import MiOS from './mios';
import { version, codename, lang, locale } from './config';
import { builtinThemes, applyTheme, darkTheme } from './theme';
import Dialog from './common/views/components/dialog.vue';
import directives from './common/views/directives';
import components from './common/views/components';
import widgets from './common/views/widgets';

if (localStorage.getItem('theme') == null) {
	applyTheme(darkTheme);
}

//#region FontAwesome
import { library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';

import {
	faRetweet,
	faPlus,
	faUser,
	faCog,
	faCheck,
	faStar,
	faReply,
	faEllipsisH,
	faQuoteLeft,
	faQuoteRight,
	faAngleUp,
	faAngleDown,
	faAt,
	faHashtag,
	faHome,
	faGlobe,
	faCircle,
	faList,
	faHeart,
	faUnlock,
	faRssSquare,
	faSort,
	faChartPie,
	faChartBar,
	faPencilAlt,
	faColumns,
	faComments,
	faGamepad,
	faCloud,
	faPowerOff,
	faChevronCircleLeft,
	faChevronCircleRight,
	faShareAlt,
	faTimes,
	faThumbtack,
	faSearch,
	faAngleRight,
	faWrench,
	faTerminal,
	faMoon,
	faPalette,
	faSlidersH,
	faDesktop,
	faVolumeUp,
	faLanguage,
	faInfoCircle,
	faExclamationTriangle,
	faKey,
	faBan,
	faCogs,
	faUnlockAlt,
	faPuzzlePiece,
	faMobileAlt,
	faSignInAlt,
	faSyncAlt,
	faPaperPlane,
	faUpload,
	faMapMarkerAlt,
	faEnvelope,
	faLock,
	faFolderOpen,
	faBirthdayCake,
	faImage,
	faEye,
	faDownload,
	faFileImport,
	faLink,
	faArrowRight,
	faICursor,
	faCaretRight,
	faReplyAll,
	faCamera,
	faMinus,
	faCaretDown,
	faCalculator,
	faUsers,
	faBars,
	faFileImage,
	faPollH,
	faFolder,
	faMicrochip,
	faMemory,
	faServer,
	faExclamationCircle,
	faSpinner,
	faBroadcastTower,
	faChartLine,
	faEllipsisV,
	faStickyNote,
	faUserClock,
	faUserPlus,
	faExternalLinkSquareAlt,
	faSync,
	faArrowLeft,
	faMapMarker,
	faRobot,
	faHourglassHalf,
	faGavel,
	faUndoAlt,
	faCode,
	faTh,
	faMars,
	faVenus,
	faGenderless,
	faUserFriends,
	faFish,
	faComment,
	faQuestionCircle,
	faCrown,
} from '@fortawesome/free-solid-svg-icons';

import {
	faBell as farBell,
	faEnvelope as farEnvelope,
	faComments as farComments,
	faTrashAlt as farTrashAlt,
	faWindowRestore as farWindowRestore,
	faFolder as farFolder,
	faLaugh as farLaugh,
	faSmile as farSmile,
	faEyeSlash as farEyeSlash,
	faFolderOpen as farFolderOpen,
	faSave as farSave,
	faImages as farImages,
	faChartBar as farChartBar,
	faCommentAlt as farCommentAlt,
	faClock as farClock,
	faCalendarAlt as farCalendarAlt,
	faHdd as farHdd,
	faMoon as farMoon,
	faPlayCircle as farPlayCircle,
	faLightbulb as farLightbulb,
	faStickyNote as farStickyNote,
} from '@fortawesome/free-regular-svg-icons';

import {
	faTwitter as fabTwitter,
	faGithub as fabGithub,
	faDiscord as fabDiscord,
} from '@fortawesome/free-brands-svg-icons';
import i18n from './i18n';
import { useStore } from './stores';
import { pinia } from './stores/pinia';
import { api, ayuskeyApi } from './api';
import { $i } from './account';
import { AYUX } from './stores/ayux';

library.add(
	faRetweet,
	faPlus,
	faUser,
	faCog,
	faCheck,
	faStar,
	faReply,
	faEllipsisH,
	faQuoteLeft,
	faQuoteRight,
	faAngleUp,
	faAngleDown,
	faAt,
	faHashtag,
	faHome,
	faGlobe,
	faCircle,
	faList,
	faHeart,
	faUnlock,
	faRssSquare,
	faSort,
	faChartPie,
	faChartBar,
	faPencilAlt,
	faColumns,
	faComments,
	faGamepad,
	faCloud,
	faPowerOff,
	faChevronCircleLeft,
	faChevronCircleRight,
	faShareAlt,
	faTimes,
	faThumbtack,
	faSearch,
	faAngleRight,
	faWrench,
	faTerminal,
	faMoon,
	faPalette,
	faSlidersH,
	faDesktop,
	faVolumeUp,
	faLanguage,
	faInfoCircle,
	faExclamationTriangle,
	faKey,
	faBan,
	faCogs,
	faUnlockAlt,
	faPuzzlePiece,
	faMobileAlt,
	faSignInAlt,
	faSyncAlt,
	faPaperPlane,
	faUpload,
	faMapMarkerAlt,
	faEnvelope,
	faLock,
	faFolderOpen,
	faBirthdayCake,
	faImage,
	faEye,
	faDownload,
	faFileImport,
	faLink,
	faArrowRight,
	faICursor,
	faCaretRight,
	faReplyAll,
	faCamera,
	faMinus,
	faCaretDown,
	faCalculator,
	faUsers,
	faBars,
	faFileImage,
	faPollH,
	faFolder,
	faMicrochip,
	faMemory,
	faServer,
	faExclamationCircle,
	faSpinner,
	faBroadcastTower,
	faChartLine,
	faEllipsisV,
	faStickyNote,
	faUserClock,
	faUserPlus,
	faExternalLinkSquareAlt,
	faSync,
	faArrowLeft,
	faMapMarker,
	faRobot,
	faHourglassHalf,
	faGavel,
	faUndoAlt,
	faCode,
	faTh,
	faMars,
	faVenus,
	faGenderless,
	faUserFriends,
	faFish,
	faComment,
	faQuestionCircle,
	faCrown,

	farBell,
	farEnvelope,
	farComments,
	farTrashAlt,
	farWindowRestore,
	farFolder,
	farLaugh,
	farSmile,
	farEyeSlash,
	farFolderOpen,
	farSave,
	farImages,
	farChartBar,
	farCommentAlt,
	farClock,
	farCalendarAlt,
	farHdd,
	farMoon,
	farPlayCircle,
	farLightbulb,
	farStickyNote,

	fabTwitter,
	fabGithub,
	fabDiscord
);
//#endregion

//Vue.use(Vuex);
//Vue.use(VueRouter);
Vue.use(VAnimateCss);
Vue.use(VModal);
Vue.use(VueHotkey);
Vue.use(VueSize);
Vue.use(VueI18n);
Vue.use(SequentialEntrance);
Vue.use(hljs.vuePlugin);

// Register global filters
require('./common/views/filters');

function initMixin(app: App) {
	app.mixin({
		methods: {
			destroyDom() {
				this.$destroy();

				if (this.$el.parentNode) {
					this.$el.parentNode.removeChild(this.$el);
				}
			},
		},
	});
}

/**
 * APP ENTRY POINT!
 */

console.info('Misskey v11.37.1 (daybreak)');
console.info(`Ayuskey v${version} (${codename})`);
console.info('%cSTOP', 'color: red; font-size: 100px; font-weight: bold;');
console.info(
	`%c${locale['common']['do-not-copy-paste']}`,
	'color: red; background: yellow; font-size: 16px; font-weight: bold;'
);
console.info(
	`%c${locale['common']['if-you-know']} https://go.akirin.xyz/ayuskey`,
	'font-size: 16px;'
);
// BootTimer解除
window.clearTimeout((window as any).mkBootTimer);
delete (window as any).mkBootTimer;

// boot.jsのやつを解除
window.onerror = null;
window.onunhandledrejection = null;

//#region Set lang attr
const html = document.documentElement;
html.setAttribute('lang', lang);
//#endregion

// iOSでプライベートモードだとlocalStorageが使えないので既存のメソッドを上書きする
try {
	localStorage.setItem('kyoppie', 'yuppie');
} catch (err) {
	Storage.prototype.setItem = () => {}; // noop
}

// クライアントを更新すべきならする
if (localStorage.getItem('should-refresh') === 'true') {
	localStorage.removeItem('should-refresh');
	location.reload(true);
}

// MiOSを初期化してコールバックする
export default (
	callback: (launch: (router: Router) => [App, MiOS], os: MiOS) => void,
	sw = false
) => {
	const os = new MiOS(sw);

	os.init(() => {
		// アプリ基底要素マウント
		document.body.innerHTML = '<div id="app"></div>';

		const launch = (router: Router) => {
			const app = createApp({
				i18n: i18n(),
				data() {
					return {
						os: {
							windows: os.windows,
						},
						stream: os.stream,
						instanceName: os.instanceName,
					};
				},
				methods: {
					api: os.api,
					getMeta: os.getMeta,
					getMetaSync: os.getMetaSync,
					signout: os.signout,
					new(vm, props) {
						const x = new vm({
							parent: this,
							propsData: props,
						}).$mount();
						document.body.appendChild(x.$el);
						return x;
					},
					newAsync(vm, props) {
						return new Promise((res) => {
							vm().then((vm) => {
								const x = new vm({
									parent: this,
									propsData: props,
								}).$mount();
								document.body.appendChild(x.$el);
								res(x);
							});
						});
					},
					dialog(opts) {
						const vm = this.new(Dialog, opts);
						const p: any = new Promise((res) => {
							vm.$once('ok', (result) => res({ canceled: false, result }));
							vm.$once('cancel', () => res({ canceled: true }));
						});
						p.close = () => {
							vm.close();
						};
						return p;
					},
				},
				render: () => h(AppBase),
			});

			app.use(os.store);
			app.use(router);
			app.use(pinia);
			//#region theme
			const ayux = AYUX();
			ayux.setAllDefault();
			const store = useStore();
			ayuskeyApi.call('POST', '/i').then((res) => {
				if (res.type === 'failed') {
					throw new Error(JSON.stringify(res.data));
				}
				ayux.set('i', res.data);
				store.i.$patch(res.data);
			});
			store.device.$subscribe((mutation, state) => {
				const themes = store.device.themes.concat(builtinThemes);
				const dark = themes.find((t) => t.id === store.device.darkTheme);
				const light = themes.find(
					(t) => t.id === os.store.state.device.lightTheme
				);
				applyTheme(state.darkmode ? dark : light);
			});
			os.store.watch(
				(s) => {
					return s.device.lightTheme;
				},
				(v) => {
					const themes = os.store.state.device.themes.concat(builtinThemes);
					const theme = themes.find((t) => t.id === v);
					if (!os.store.state.device.darkmode) {
						applyTheme(theme);
					}
				}
			);
			os.store.watch(
				(s) => {
					return s.device.darkTheme;
				},
				(v) => {
					const themes = os.store.state.device.themes.concat(builtinThemes);
					const theme = themes.find((t) => t.id === v);
					if (os.store.state.device.darkmode) {
						applyTheme(theme);
					}
				}
			);
			//#endregion

			/*// Reapply current theme
			try {
				const themeName = os.store.state.device.darkmode ? os.store.state.device.darkTheme : os.store.state.device.lightTheme;
				const themes = os.store.state.device.themes.concat(builtinThemes);
				const theme = themes.find(t => t.id == themeName);
				if (theme) {
					applyTheme(theme);
				}
			} catch (e) {
				console.log(`Cannot reapply theme. ${e}`);
			}*/

			//#region line width
			document.documentElement.style.setProperty(
				'--lineWidth',
				`${os.store.state.device.lineWidth}px`
			);
			os.store.watch(
				(s) => {
					return s.device.lineWidth;
				},
				(v) => {
					document.documentElement.style.setProperty(
						'--lineWidth',
						`${os.store.state.device.lineWidth}px`
					);
				}
			);
			//#endregion

			//#region fontSize
			document.documentElement.style.setProperty(
				'--fontSize',
				`${os.store.state.device.fontSize}px`
			);
			os.store.watch(
				(s) => {
					return s.device.fontSize;
				},
				(v) => {
					document.documentElement.style.setProperty(
						'--fontSize',
						`${os.store.state.device.fontSize}px`
					);
				}
			);
			//#endregion

			document.addEventListener(
				'visibilitychange',
				() => {
					if (!document.hidden) {
						os.store.commit('clearBehindNotes');
					}
				},
				false
			);

			window.addEventListener(
				'scroll',
				() => {
					if (window.scrollY <= 8) {
						os.store.commit('clearBehindNotes');
					}
				},
				{ passive: true }
			);

			initMixin(app);

			// Register global directives
			directives(app);

			// Register global components
			components(app);
			widgets(app);

			app.config.globalProperties.$api = os.api,
			app.component('Fa', FontAwesomeIcon);

			os.app = app;

			// マウント
			app.mount('#app');

			// FIXME
			//#region 更新チェック
			/*
			setTimeout(() => {
				checkForUpdate(app);
			}, 3000);
			//#endregion
			*/

			return [app, os] as [App<Element>, MiOS];
		};

		// Deck mode
		os.store.commit('device/set', {
			key: 'inDeckMode',
			value:
				os.store.getters.isSignedIn &&
				os.store.state.device.deckMode &&
				(document.location.pathname === '/' ||
					window.performance.navigation.type === 1),
		});

		callback(launch, os);
	});
};
