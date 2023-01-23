<template>
<div class="muteblockuser">
	<div class="avatar-link">
		<a :href="userPage(user, null, true)">
			<mk-avatar class="avatar" :user="user" :disable-link="true"/>
		</a>
	</div>
	<div class="text">
		<div><mk-user-name :user="user"/></div>
		<div class="username">@{{ acct(user) }}</div>
	</div>
</div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import i18n from '../../../../i18n';
import { acct, userPage } from '../../filters/v12/user';

export default defineComponent({
	i18n: i18n('common/views/components/mute-and-block.user.vue'),
	props: ['user'],
	methods: {
		acct, userPage,
	},
});
</script>

<style lang="stylus" scoped>
.muteblockuser
	display flex
	padding 16px

	> .avatar-link
		> a
			> .avatar
				width 40px
				height 40px

	> .text
		color var(--text)
		margin-left 16px
</style>
