<template>
<div v-hotkey.global="keymap" class="account">
	<button class="header" :data-active="isOpen" @click="toggle">
		<span class="username">{{ store.i.username }}<template v-if="!isOpen"><fa icon="angle-down"/></template><template v-if="isOpen"><fa icon="angle-up"/></template></span>
		<mk-avatar class="avatar" :user="store.i"/>
	</button>
	<transition name="zoom-in-top">
		<div v-if="isOpen" class="menu" :style="{'backdrop-filter': `blur(${blurStrength}em)`}">
			<ul>
				<li>
					<router-link :to="`/@${ store.i.username }`">
						<i><fa icon="user" fixed-width/></i>
						<span>{{ i18n.t('profile') }}</span>
						<i><fa icon="angle-right"/></i>
					</router-link>
				</li>
				<li @click="drive">
					<p>
						<i><fa icon="cloud" fixed-width/></i>
						<span>{{ i18n.t('@.drive') }}</span>
						<i><fa icon="angle-right"/></i>
					</p>
				</li>
				<li>
					<router-link to="/i/favorites">
						<i><fa icon="star" fixed-width/></i>
						<span>{{ i18n.t('@.favorites') }}</span>
						<i><fa icon="angle-right"/></i>
					</router-link>
				</li>
				<li>
					<router-link to="/i/lists">
						<i><fa icon="list" fixed-width/></i>
						<span>{{ i18n.t('lists') }}</span>
						<i><fa icon="angle-right"/></i>
					</router-link>
				</li>
				<li>
					<router-link to="/i/groups">
						<i><fa :icon="faUsers" fixed-width/></i>
						<span>{{ i18n.t('groups') }}</span>
						<i><fa icon="angle-right"/></i>
					</router-link>
				</li>
				<li>
					<router-link to="/i/pages">
						<i><fa :icon="faStickyNote" fixed-width/></i>
						<span>{{ i18n.t('@.pages') }}</span>
						<i><fa icon="angle-right"/></i>
					</router-link>
				</li>
				<li>
					<router-link to="/i/follow-requests">
						<i><fa :icon="['far', 'envelope']" fixed-width/></i>
						<span>{{ i18n.t('follow-requests') }}<i v-if="$store.state.i.pendingReceivedFollowRequestsCount">{{ i18n.t(`follow-request-${$store.state.i.pendingReceivedFollowRequestsCount}`) }}</i></span>
						<i><fa icon="angle-right"/></i>
					</router-link>
				</li>
				<li>
					<router-link :to="`/@${ store.i.username }/room`">
						<i><fa :icon="faDoorOpen" fixed-width/></i>
						<span>{{ i18n.t('room') }}</span>
						<i><fa icon="angle-right"/></i>
					</router-link>
				</li>
			</ul>
			<ul>
				<li>
					<router-link to="/i/settings">
						<i><fa icon="cog" fixed-width/></i>
						<span>{{ i18n.t('@.settings') }}</span>
						<i><fa icon="angle-right"/></i>
					</router-link>
				</li>
				<li v-if="store.i.isAdmin || store.i.isModerator">
					<a href="/admin">
						<i><fa icon="terminal" fixed-width/></i>
						<span>{{ i18n.t('admin') }}</span>
						<i><fa icon="angle-right"/></i>
					</a>
				</li>
			</ul>
			<ul>
				<li @click="toggleDeckMode">
					<p>
						<template v-if="store.device.deckMode"><i><fa :icon="faHome"/></i><span>{{ i18n.t('@.home') }}</span></template>
						<template v-else><i><fa :icon="faColumns"/></i><span>{{ i18n.t('@.deck') }}</span></template>
					</p>
				</li>
				<li @click="dark">
					<p>
						<template><i><fa :icon="store.device.darkmode ? faSun : faMoon"/></i></template>
						<span>{{ store.device.darkmode ? i18n.t('@.turn-off-darkmode') : i18n.t('@.turn-on-darkmode') }}</span>
					</p>
				</li>
			</ul>
			<ul>
				<li @click="signout">
					<p class="signout">
						<i><fa icon="power-off" fixed-width/></i>
						<span>{{ i18n.t('@.signout') }}</span>
					</p>
				</li>
			</ul>
		</div>
	</transition>
</div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { i18n as _i18n } from '../../../i18n';
// import MkSettingsWindow from './settings-window.vue';
import MkDriveWindow from './drive-window.vue';
import contains from '../../../common/scripts/contains';
import { faHome, faColumns, faUsers, faDoorOpen } from '@fortawesome/free-solid-svg-icons';
import { faMoon, faSun, faStickyNote } from '@fortawesome/free-regular-svg-icons';
import { useStore } from '../../../stores';

export default defineComponent({
	compatConfig: {
		MODE: 3,
	},
	data() {
		return {
			store: useStore(),
			i18n: _i18n('desktop/views/components/ui.header.account.vue'),
			isOpen: false,
			blurStrength: 0,
			faHome, faColumns, faMoon, faSun, faStickyNote, faUsers, faDoorOpen,
		};
	},
	computed: {
		keymap(): any {
			return {
				'a|m': this.toggle,
			};
		},
	},
	beforeUnmount() {
		this.close();
	},
	mounted() {
		if (this.store.device.useBlur === false) {
			return;
		}
		if (this.store.device.darkmode === true) { // ダークテーマが有効の場合のみblurを強化
			this.blurStrength = 2;
		} else {
			this.blurStrength = 0.3;
		}
	},
	methods: {
		toggle() {
			this.isOpen ? this.close() : this.open();
		},
		open() {
			this.isOpen = true;
			for (const el of Array.from(document.querySelectorAll('body *'))) {
				el.addEventListener('mousedown', this.onMousedown);
			}
		},
		close() {
			this.isOpen = false;
			for (const el of Array.from(document.querySelectorAll('body *'))) {
				el.removeEventListener('mousedown', this.onMousedown);
			}
		},
		onMousedown(ev) {
			ev.preventDefault();
			if (!contains(this.$el, ev.target) && this.$el !== ev.target) this.close();
			return false;
		},
		drive() {
			this.close();
			this.$root.new(MkDriveWindow);
		},
		signout() {
			this.$root.signout();
		},
		dark() {
			this.store.device.darkmode = !this.store.device.darkmode;
		},
		toggleDeckMode() {
			this.store.device.deckMode = !this.store.device.deckMode;
			location.replace('/');
		},
	},
});
</script>

<style lang="stylus" scoped>
.account
	> .header
		display block
		margin 0
		padding 0
		color var(--desktopHeaderFg)
		border none
		background transparent
		cursor pointer

		*
			pointer-events none

		&:hover
		&[data-active='true']
			color var(--desktopHeaderHoverFg)

			> .avatar
				filter saturate(150%)

		> .username
			display block
			float left
			margin 0 12px 0 16px
			max-width 16em
			line-height 48px
			font-weight bold
			text-decoration none

			@media (max-width 1100px)
				display none

			[data-icon]
				margin-left 8px

		> .avatar
			display block
			float left
			min-width 32px
			max-width 32px
			min-height 32px
			max-height 32px
			margin 8px 8px 8px 0
			border-radius 4px
			transition filter 100ms ease

			@media (max-width 1100px)
				margin-left 8px

	> .menu
		$bgcolor = var(--face)
		display block
		position absolute
		top 56px
		right -2px
		width 230px
		font-size 0.8em
		background $bgcolor
		border-radius 4px
		box-shadow 0 var(--lineWidth) 4px rgba(#000, 0.25)

		&:before
			content ""
			pointer-events none
			display block
			position absolute
			top -28px
			right 12px
			border-top solid 14px transparent
			border-right solid 14px transparent
			border-bottom solid 14px rgba(#000, 0.1)
			border-left solid 14px transparent

		&:after
			content ""
			pointer-events none
			display block
			position absolute
			top -27px
			right 12px
			border-top solid 14px transparent
			border-right solid 14px transparent
			border-bottom solid 14px $bgcolor
			border-left solid 14px transparent

		ul
			display block
			margin 10px 0
			padding 0
			list-style none

			& + ul
				padding-top 10px
				border-top solid var(--lineWidth) var(--faceDivider)

			> li
				display block
				margin 0
				padding 0

				> a
				> p
					display block
					z-index 1
					padding 0 28px
					margin 0
					line-height 40px
					color var(--text)
					cursor pointer

					*
						pointer-events none

					> span:first-child
						padding-left 22px

					> span:nth-child(2)
						> i
							margin-left 4px
							padding 2px 8px
							font-size 90%
							font-style normal
							background var(--primary)
							color var(--primaryForeground)
							border-radius 8px

					> i:first-child
						margin-right 6px
						width 16px

					> i:last-child
						display block
						position absolute
						top 0
						right 8px
						z-index 1
						padding 0 20px
						font-size 1.2em
						line-height 40px

					&:hover, &:active
						text-decoration none
						background var(--primary)
						color var(--primaryForeground)

					&:active
						background var(--primaryDarken10)

					&.signout
						$color = #e64137

						&:hover, &:active
							background $color
							color #fff

						&:active
							background darken($color, 10%)

.zoom-in-top-enter-active,
.zoom-in-top-leave-active {
	transform-origin: center -16px;
}

</style>
