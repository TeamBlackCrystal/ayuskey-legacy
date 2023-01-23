<template>
<header class="bvonvjxbwzaiskogyhbwgyxvcgserpmu">
	<mk-avatar v-if="$store.state.device.postStyle == 'smart'" class="avatar" :user="note.user"/>
	<router-link v-user-preview="note.user.id" class="name" :to="userPage(note.user)">
		<mk-user-name :user="note.user"/>
	</router-link>
	<span v-if="note.user.isPremium" class="is-premium"><fa icon="crown"/></span>
	<span v-if="note.user.isAdmin" class="is-admin" :title="$t('@.admin-user')">admin</span>
	<span v-if="note.user.isBot" class="is-bot" :title="$t('@.bot-user')">bot</span>
	<span v-if="note.user.isCat" class="is-cat" :title="$t('@.cat-user')">cat</span>
	<span v-if="note.user.isLady" class="is-lady" :title="$t('@.lady-user')">lady</span>
	<span class="username"><mk-acct :user="note.user"/></span>
	<span v-if="note.user.isVerified" class="is-verified" :title="$t('@.verified-user')"><fa icon="star"/></span>
	<div class="info">
		<span v-if="note.app && !mini && $store.state.settings.showVia" class="app">via <b>{{ note.app.name }}</b></span>
		<span v-if="note.viaMobile" class="mobile"><fa icon="mobile-alt"/></span>
		<router-link class="created-at" :to="notePage(note)">
			<mk-time :time="note.createdAt"/>
		</router-link>
		<x-visibility-icon class="visibility" :v="note.visibility" :local-only="note.localOnly" :copy-once="note.copyOnce"/>
		<span v-if="note.user.host != null" class="remote" title="Remote post"><fa :icon="faGlobeAmericas"/></span>
	</div>
</header>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import i18n from '../../../i18n';
import { faGlobeAmericas } from '@fortawesome/free-solid-svg-icons';
import XVisibilityIcon from '../../../common/views/components/visibility-icon.vue';
import { userPage } from '../filters/v12/user';
import notePage from '../filters/v12/note';

export default defineComponent({
	i18n: i18n(),
	components: {
		XVisibilityIcon,
	},
	props: {
		note: {
			type: Object,
			required: true,
		},
		mini: {
			type: Boolean,
			required: false,
			default: false,
		},
	},
	data() {
		return {
			faGlobeAmericas,
		};
	},
	methods: {
		userPage, notePage
	},
});
</script>

<style lang="stylus" scoped>
.bvonvjxbwzaiskogyhbwgyxvcgserpmu
	display flex
	align-items baseline
	white-space nowrap

	> .avatar
		flex-shrink 0
		margin-right 8px
		width 20px
		height 20px
		border-radius 100%

	> .name
		display block
		margin 0 .5em 0 0
		padding 0
		overflow hidden
		color var(--noteHeaderName)
		font-size 1em
		font-weight bold
		text-decoration none
		text-overflow ellipsis

		&:hover
			text-decoration underline

	> .is-admin
	> .is-bot
	> .is-cat
	> .is-lady
		flex-shrink 0
		align-self center
		margin 0 .5em 0 0
		padding 1px 6px
		font-size 80%
		color var(--noteHeaderBadgeFg)
		background var(--noteHeaderBadgeBg)
		border-radius 3px

		&.is-admin
			background var(--noteHeaderAdminBg)
			color var(--noteHeaderAdminFg)

	> .username
		margin 0 .5em 0 0
		overflow hidden
		text-overflow ellipsis
		color var(--noteHeaderAcct)
		flex-shrink 2147483647

	> .is-verified
		margin 0 .5em 0 0
		color #4dabf7
	> .is-premium
		margin 0 .5em 0 0
		color #FFC107

	> .info
		margin-left auto
		font-size 0.9em

		> *
			color var(--noteHeaderInfo)

		> .mobile
			margin-right 8px

		> .app
			margin-right 8px
			padding-right 8px
			border-right solid 1px var(--faceDivider)

		> .visibility
			margin-left 8px
			display inline-block

		> .localOnly
			margin-left 4px
			color var(--primary)

		> .remote
			margin-left 4px
			color #4dabf7

</style>
