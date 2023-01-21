<template>
<!--
<div class="mk-user-preview" :class="{'blur': $store.state.device.useBlur}">
	<template v-if="u != null">
		<div class="banner" :style="u.bannerUrl ? `background-image: url(${u.bannerUrl})` : ''"></div>
		<mk-avatar class="avatar" :user="u" :disable-preview="true"/>
		<div class="title">
			<router-link class="name" :to="userPage(u)"><mk-user-name :user="u" :nowrap="false"/></router-link>
			<p class="username"><mk-acct :user="u"/></p>
		</div>
		<div class="description">
			<mfm v-if="u.description" :text="u.description" :author="u" :i="$store.state.i" :custom-emojis="u.emojis"/>
		</div>
		<div class="status">
			<div>
				<p>{{ $t('notes') }}</p><span>{{ u.notesCount }}</span>
			</div>
			<div>
				<p>{{ $t('following') }}</p><span>{{ u.followingCount }}</span>
			</div>
			<div>
				<p>{{ $t('followers') }}</p><span>{{ u.followersCount }}</span>
			</div>
		</div>
		<mk-follow-button v-if="$store.getters.isSignedIn && u.id != $store.state.i.id" class="koudoku-button" :user="u" mini/>
	</template>
</div>
-->
<transition name="popup" appear :class="{'blur': $store.state.device.useBlur}" @after-leave="$emit('closed')">
	<div v-if="showing" class="fxxzrfni _popup _shadow" :style="{ top: top + 'px', left: left + 'px' }" @mouseover="() => { $emit('mouseover'); }" @mouseleave="() => { $emit('mouseleave'); }" >
		<div v-if="fetched" class="info">
			<div class="banner" :style="user.bannerUrl ? `background-image: url(${user.bannerUrl})` : ''"></div>
			<mk-avatar class="avatar" :user="user" :disable-preview="true"/>
			<div class="title">
				<router-link class="name" :to="userPage(user)"><mk-user-name :user="user" :nowrap="false"/></router-link>
				<p class="username"><mk-acct :user="user"/></p>
			</div>
			<div class="description">
				<mfm v-if="user.description" :text="user.description" :author="user" :i="$i" :custom-emojis="user.emojis"/>
			</div>
			<div class="status">
				<div>
					<p>{{ i18n.t('notes') }}</p><span>{{ user.notesCount }}</span>
				</div>
				<div>
					<p>{{ i18n.t('following') }}</p><span>{{ user.followingCount }}</span>
				</div>
				<div>
					<p>{{ i18n.t('followers') }}</p><span>{{ user.followersCount }}</span>
				</div>
			</div>
			<mk-follow-button v-if="$store.getters.isSignedIn && user.id != $store.state.i.id" class="koudoku-button" :user="user" mini/>
		</div>
		<div v-else>
			<MkLoading/>
		</div>
	</div>
</transition>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import * as Acct from 'ayuskey.js/built/acct';
import { i18n as _i18n } from '../../../i18n';
import { userPage } from '../../../common/views/filters/v12/user';
import { $i } from '../../../account';
import { api } from '../../../api';

/*
compatConfig({
	MODE: 3,
	GLOBAL_MOUNT: true,
	GLOBAL_EXTEND: true,
	INSTANCE_SET: true,
	INSTANCE_DELETE: true,
	INSTANCE_EVENT_EMITTER: true,
	INSTANCE_CHILDREN: true,
	INSTANCE_LISTENERS: true,
	INSTANCE_DESTROY: true,
	OPTIONS_BEFORE_DESTROY: true,
});*/

export default defineComponent({
	compatConfig: {
		MODE: 3,
	},
	props: {
		showing: {
			type: Boolean,
			required: true,
		},
		q: {
			type: String,
			required: true,
		},
		source: {
			required: true,
			type: HTMLElement,
		},
	},

	emits: ['closed', 'mouseover', 'mouseleave'],

	data() {
		return {
			user: null,
			fetched: false,
			top: 0,
			left: 0,
			$i,
			i18n: _i18n('desktop/views/components/user-preview.vue'),
		};
	},

	mounted() {
		console.log("hoge", this.user, this.q);
		if (typeof this.q === 'object') {
			this.user = this.q;
			this.fetched = true;
		} else {
			const query = this.user.startsWith('@') ?
				Acct.parse(this.user.substr(1)) :
				{ userId: (this.user as string) };

			/*
			this.$root.api('users/show', query).then(user => {
				this.u = user;
				this.open();
			});
			*/
			api.request("users/show", query).then(user => {
				if (!this.showing) return;
				this.user = user;
				this.fetched = true;
			});
		}

		const rect = this.source.getBoundingClientRect();
		const x = ((rect.left + (this.source.offsetWidth / 2)) - (300 / 2)) + window.pageXOffset;
		const y = rect.top + this.source.offsetHeight + window.pageYOffset;

		this.top = y;
		this.left = x;
	},

	methods: {
		userPage,
	},
});
</script>

<style lang="stylus" scoped>
/*
.blur
	backdrop-filter blur(10px)

.mk-user-preview
	position absolute
	z-index 2048
	margin-top -8px
	width 250px
	background var(--face)
	background-clip content-box
	border solid 1px rgba(#000, 0.1)
	border-radius 4px
	overflow hidden
	opacity 0

	> .banner
		height 84px
		background-color rgba(0, 0, 0, 0.1)
		background-size cover
		background-position center

	> .avatar
		display block
		position absolute
		top 62px
		left 13px
		z-index 2
		width 58px
		height 58px
		border solid 3px var(--face)
		border-radius 8px

	> .title
		display block
		padding 8px 0 8px 82px

		> .name
			display inline-block
			margin 0
			font-weight bold
			line-height 16px
			color var(--text)

		> .username
			display block
			margin 0
			line-height 16px
			font-size 0.8em
			color var(--text)
			opacity 0.7

	> .description
		padding 0 16px
		font-size 0.7em
		color var(--text)

	> .status
		padding 8px 16px

		> div
			display inline-block
			width 33%

			> p
				margin 0
				font-size 0.7em
				color var(--text)

			> span
				font-size 1em
				color var(--primary)

	> .koudoku-button
		position absolute
		top 8px
		right 8px
*/
</style>

<style lang="scss" scoped>
.blur {
	backdrop-filter: blur(10px);
}

.popup-enter-active, .popup-leave-active {
	transition: opacity 0.3s, transform 0.3s !important;
}
.popup-enter-from, .popup-leave-to {
	opacity: 0;
	transform: scale(0.9);
}
.fxxzrfni {
	position: absolute;
	z-index: 11000;
	width: 300px;
	overflow: hidden;
	transform-origin: center top;
	> .info {
		> .banner {
			height: 84px;
			background-color: rgba(0, 0, 0, 0.1);
			background-size: cover;
			background-position: center;
		}
		> .avatar {
			display: block;
			position: absolute;
			top: 62px;
			left: 13px;
			z-index: 2;
			width: 58px;
			height: 58px;
			border: solid 3px var(--face);
			border-radius: 8px;
		}
		> .title {
			display: block;
			padding: 8px 0 8px 82px;
			> .name {
				display: inline-block;
				margin: 0;
				font-weight: bold;
				line-height: 16px;
				word-break: break-all;
			}
			> .username {
				display: block;
				margin: 0;
				line-height: 16px;
				font-size: 0.8em;
				color: var(--text);
				opacity: 0.7;
			}
		}
		> .description {
			padding: 0 16px;
			font-size: 0.8em;
			color: var(--text);
		}
		> .status {
			padding: 8px 16px;
			> div {
				display: inline-block;
				width: 33%;
				> p {
					margin: 0;
					font-size: 0.7em;
					color: var(--text);
				}
				> span {
					font-size: 1em;
					color: var(--primary);
				}
			}
		}
		> .koudoku-button {
			position: absolute;
			top: 8px;
			right: 8px;
		}
	}
}
</style>
