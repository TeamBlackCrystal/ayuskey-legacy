<template>
<div class="index">
	<div class="index-body">
		<main v-if="$store.getters.isSignedIn">
			<p v-if="fetching" class="fetching">{{ $t('loading') }}<mk-ellipsis/></p>
			<x-form
				v-if="state == 'waiting'"
				ref="form"
				class="form"
				:session="session"
				@denied="state = 'denied'"
				@accepted="accepted"
			/>
			<div v-if="state == 'denied'" class="denied">
				<h1>{{ $t('denied') }}</h1>
				<p>{{ $t('denied-paragraph') }}</p>
			</div>
			<div v-if="state == 'accepted'" class="accepted">
				<h1>{{ session.app.isAuthorized ? $t('already-authorized') : $t('allowed') }}</h1>
				<p v-if="session.app.callbackUrl">{{ $t('callback-url') }}<mk-ellipsis/></p>
				<p v-if="!session.app.callbackUrl">{{ $t('please-go-back') }}</p>
			</div>
			<div v-if="state == 'fetch-session-error'" class="error">
				<p>{{ $t('error') }}</p>
			</div>
		</main>
		<main v-if="!$store.getters.isSignedIn" class="signin">
			<h1>{{ $t('sign-in') }}</h1>
			<mk-signin/>
		</main>
	</div>

	<footer><img src="/assets/auth/icon.svg" alt="Misskey"/></footer>
</div>
</template>

<script lang="ts">
import Vue from 'vue';
import i18n from '../../i18n';
import XForm from './form.vue';

export default Vue.extend({
	i18n: i18n('auth/views/index.vue'),
	components: {
		XForm,
	},
	data() {
		return {
			state: null,
			session: null,
			fetching: true,
		};
	},
	computed: {
		token(): string {
			return this.$route.params.token;
		},
	},
	mounted() {
		if (!this.$store.getters.isSignedIn) return;

		// Fetch session
		this.$root.api('auth/session/show', {
			token: this.token,
		}).then(session => {
			this.session = session;
			this.fetching = false;

			// 既に連携していた場合
			if (this.session.app.isAuthorized) {
				this.$root.api('auth/accept', {
					token: this.session.token,
				}).then(() => {
					this.accepted();
				});
			} else {
				this.state = 'waiting';
			}
		}).catch(error => {
			this.state = 'fetch-session-error';
			this.fetching = false;
		});
	},
	methods: {
		accepted() {
			this.state = 'accepted';
			if (this.session.app.callbackUrl) {
				const url = new URL(this.session.app.callbackUrl);
				if (['javascript:', 'file:', 'data:', 'mailto:', 'tel:'].includes(url.protocol)) throw new Error('invalid url');
				location.href = `${this.session.app.callbackUrl}?token=${this.session.token}`;
			}
		},
	},
});
</script>

<style lang="css">
body {
	padding: 0px !important;
}

</style>

<style lang="stylus" scoped>
.index
	background var(--bg)
	color var(--text)

	> .index-body
		display flex
		justify-content center
		align-items center
		height 100vh

		> main
			width 100%
			max-width 500px
			margin 0 auto
			text-align center
			background var(--face)
			box-shadow 0 4px 16px rgba(#000, 0.2)

			> .fetching
				margin 0
				padding 32px
				color #555

			> div:not(.form)
				padding 64px

				> h1
					margin 0 0 8px 0
					padding 0
					font-size 20px
					font-weight normal

				> p
					margin 0
					color #555

				&.denied > h1
					color #e65050

				&.accepted > h1
					color #54af7c

			&.signin
				padding 32px 32px 16px 32px

				> h1
					margin 0 0 22px 0
					padding 0
					font-size 20px
					font-weight normal
					color var(--text)

			@media (max-width 600px)
				max-width none
				box-shadow none

			@media (max-width 500px)
				> div
					> h1
						font-size 16px

	> footer
		> img
			display block
			width 32px
			height 32px
			margin auto auto

</style>
