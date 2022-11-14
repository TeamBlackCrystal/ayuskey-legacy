<template>
<div class="kofvwchc">
	<div>
		<a :href="user | userPage(null, true)">
			<mk-avatar class="avatar" :user="user" :disable-link="true"/>
		</a>
	</div>
	<div @click="click(user.id)">
		<header>
			<b><mk-user-name :user="user"/></b>
			<span class="username">@{{ user | acct }}</span>
			<span v-if="user.isAdmin" class="is-admin">admin</span>
			<span v-if="user.isModerator" class="is-moderator">moderator</span>
			<span v-if="user.isVerified" class="is-verified" :title="$t('@.verified-user')"><fa icon="star"/></span>
			<span v-if="user.isPremium" class="is-premium" :title="$t('@.premium-user')"><fa icon="crown"/></span>
			<span v-if="user.isSilenced" class="is-silenced" :title="$t('@.silenced-user')"><fa :icon="faMicrophoneSlash"/></span>
			<span v-if="user.isSuspended" class="is-suspended" :title="$t('@.suspended-user')"><fa :icon="faSnowflake"/></span>
		</header>
		<div>
			<span>{{ $t('users.updatedAt') }}: <mk-time :time="user.updatedAt" mode="detail"/></span>
		</div>
		<div>
			<span>{{ $t('users.createdAt') }}: <mk-time :time="user.createdAt" mode="detail"/></span>
		</div>
	</div>
</div>
</template>

<script lang="ts">
import Vue from 'vue';
import i18n from '../../i18n';
import { faMicrophoneSlash } from '@fortawesome/free-solid-svg-icons';
import { faSnowflake } from '@fortawesome/free-regular-svg-icons';

export default Vue.extend({
	i18n: i18n('admin/views/users.vue'),
	props: ['user', 'click'],
	data() {
		return {
			faSnowflake, faMicrophoneSlash,
		};
	},
});
</script>

<style lang="stylus" scoped>
.kofvwchc
	display flex
	padding 16px
	border-top solid 1px var(--faceDivider)

	> div:first-child
		> a
			> .avatar
				width 64px
				height 64px

	> div:last-child
		flex 1
		cursor pointer
		padding-left 16px

		@media (max-width 500px)
			font-size 14px

		> header
			> .username
				margin-left 8px
				opacity 0.7

			> .is-admin
			> .is-moderator
				flex-shrink 0
				align-self center
				margin 0 0 0 .5em
				padding 1px 6px
				font-size 80%
				border-radius 3px
				background var(--noteHeaderAdminBg)
				color var(--noteHeaderAdminFg)
			> .is-verified
			> .is-silenced
			> .is-suspended
				margin 0 0 0 .5em
				color #4dabf7
			> .is-premium
				margin 0 0 0 .5em
				color #FFC107
	&:hover
		color var(--primaryForeground)
		background var(--primary)
		text-decoration none
		border-radius 3px

	&:active
		color var(--primaryForeground)
		background var(--primaryDarken10)
		border-radius 3px
</style>
