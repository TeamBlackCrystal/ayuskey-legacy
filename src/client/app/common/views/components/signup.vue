<script setup lang="ts">
import { ref } from 'vue';
import { toUnicode } from 'punycode';
import { host, url } from '../../../config';
import _i18n from '../../../i18n';
import { api } from '../../../os';

const getPasswordStrength = require('syuilo-password-strength');
const i18n = _i18n('common/views/components/signup.vue');
const unicodeHost = toUnicode(host);
const username = ref('');
const password = ref('');
const retypedPassword = ref('');
const invitationCode = '';
const usernameState = ref('');
const passwordStrength = ref('');
const passwordRetypeState = ref(null);
const meta = {};
const submitting = false;
const ToSAgreement = false;
const reCaptchaResponse = null;
const hCaptchaResponse = null;

function onChangeUsername() {
	if (username.value === '') {
		usernameState.value = null;
		return;
	}

	const err =
		!username.value.match(/^[a-zA-Z0-9_]+$/) ? 'invalid-format' :
		username.value.length < 1 ? 'min-range' :
		username.value.length > 20 ? 'max-range' :
		null;

	if (err) {
		usernameState.value = err;
		return;
	}

	usernameState.value = 'wait';

	api('username/available', {
		username: username.value,
	}).then(result => {
		usernameState.value = result.available ? 'ok' : 'unavailable';
	}).catch(err => {
		usernameState.value = 'error';
	});
}

function onChangePassword() {
	if (password.value === '') {
		passwordStrength.value = '';
		return;
	}

	const strength = getPasswordStrength(password);
	passwordStrength.value = strength > 0.7 ? 'high' : strength > 0.3 ? 'medium' : 'low';
}

function onChangePasswordRetype() {
	if (retypedPassword.value === '') {
		passwordRetypeState.value = null;
		return;
	}
	console.log('ここ2', retypedPassword, password);
	passwordRetypeState.value = password.value === retypedPassword.value ? 'match' : 'not-match';
}

</script>

<template>
<form class="mk-signup" :autocomplete="Math.random()" @submit.prevent="onSubmit">
	<template v-if="meta">
		<ui-input v-if="meta.disableRegistration" v-model="invitationCode" type="text" :autocomplete="Math.random()" spellcheck="false" required styl="fill">
			<span>{{ $t('invitation-code') }}</span>
			<template #prefix><fa icon="id-card-alt"/></template>
			<template #desc v-html="$t('invitation-info').replace('{}', 'mailto:' + meta.maintainerEmail)"></template>
		</ui-input>
		<ui-input v-model="username" type="text" pattern="^[a-zA-Z0-9_]{1,20}$" :autocomplete="Math.random()" spellcheck="false" required styl="fill" @input="onChangeUsername">
			<span>{{ $t('username') }}</span>
			<template #prefix>@</template>
			<template #suffix>@{{ unicodeHost }}</template>
			<template #desc>
				<span v-if="usernameState == 'wait'" style="color:#999"><fa icon="spinner" pulse fixed-width/> {{ $t('checking') }}</span>
				<span v-if="usernameState == 'ok'" style="color:#3CB7B5"><fa icon="check" fixed-width/> {{ $t('available') }}</span>
				<span v-if="usernameState == 'unavailable'" style="color:#FF1161"><fa icon="exclamation-triangle" fixed-width/> {{ $t('unavailable') }}</span>
				<span v-if="usernameState == 'error'" style="color:#FF1161"><fa icon="exclamation-triangle" fixed-width/> {{ $t('error') }}</span>
				<span v-if="usernameState == 'invalid-format'" style="color:#FF1161"><fa icon="exclamation-triangle" fixed-width/> {{ $t('invalid-format') }}</span>
				<span v-if="usernameState == 'min-range'" style="color:#FF1161"><fa icon="exclamation-triangle" fixed-width/> {{ $t('too-short') }}</span>
				<span v-if="usernameState == 'max-range'" style="color:#FF1161"><fa icon="exclamation-triangle" fixed-width/> {{ $t('too-long') }}</span>
			</template>
		</ui-input>
		<ui-input v-model="password" type="password" :autocomplete="Math.random()" required :with-password-meter="true" styl="fill" @input="onChangePassword">
			<span>{{ $t('password') }}</span>
			<template #prefix><fa icon="lock"/></template>
			<template #desc>
				<p v-if="passwordStrength == 'low'" style="color:#FF1161"><fa icon="exclamation-triangle" fixed-width/> {{ $t('weak-password') }}</p>
				<p v-if="passwordStrength == 'medium'" style="color:#3CB7B5"><fa icon="check" fixed-width/> {{ $t('normal-password') }}</p>
				<p v-if="passwordStrength == 'high'" style="color:#3CB7B5"><fa icon="check" fixed-width/> {{ $t('strong-password') }}</p>
			</template>
		</ui-input>
		<ui-input v-model="retypedPassword" type="password" :autocomplete="Math.random()" required styl="fill" @input="onChangePasswordRetype">
			<span>{{ $t('password') }} ({{ $t('retype') }})</span>
			<template #prefix><fa icon="lock"/></template>
			<template #desc>
				<p v-if="passwordRetypeState == 'match'" style="color:#3CB7B5"><fa icon="check" fixed-width/> {{ $t('password-matched') }}</p>
				<p v-if="passwordRetypeState == 'not-match'" style="color:#FF1161"><fa icon="exclamation-triangle" fixed-width/> {{ $t('password-not-matched') }}</p>
			</template>
		</ui-input>
		<ui-switch v-if="meta.ToSUrl" v-model="ToSAgreement">
			<i18n path="agree-to">
				<a :href="meta.ToSUrl" target="_blank">{{ $t('tos') }}</a>
			</i18n>
		</ui-switch>
		<captcha v-if="meta.enableRecaptcha" ref="recaptcha" v-model="reCaptchaResponse" class="captcha" provider="grecaptcha" :sitekey="meta.recaptchaSiteKey"/>
		<captcha v-if="meta.enableHcaptcha" ref="hcaptcha" v-model="hCaptchaResponse" class="captcha" provider="hcaptcha" :sitekey="meta.hcaptchaSiteKey"/>
		<ui-button type="submit" :disabled=" submitting || !(meta.ToSUrl ? ToSAgreement : true) || passwordRetypeState == 'not-match'">{{ $t('create') }}</ui-button>
	</template>
</form>
</template>


<!-- 
<script lang="ts">
import { defineComponent } from 'vue';
import i18n from '../../../i18n';
const getPasswordStrength = require('syuilo-password-strength');
import { host, url } from '../../../config';
import { toUnicode } from 'punycode';
import { $i } from '../../../account';

export default defineComponent({
	i18n: i18n('common/views/components/signup.vue'),

	components: {
		captcha: () => import('./captcha.vue').then(x => x.default),
	},

	data() {
		return {
			host: toUnicode(host),
			username: '',
			password: '',
			retypedPassword: '',
			invitationCode: '',
			url,
			usernameState: null,
			passwordStrength: '',
			passwordRetypeState: null,
			meta: {},
			submitting: false,
			ToSAgreement: false,
			reCaptchaResponse: null,
			hCaptchaResponse: null,
		};
	},

	computed: {
		shouldShowProfileUrl(): boolean {
			return (this.username !== '' &&
				this.usernameState !== 'invalid-format' &&
				this.usernameState !== 'min-range' &&
				this.usernameState !== 'max-range');
		},
	},

	created() {
		this.$root.getMeta().then(meta => {
			this.meta = meta;
		});
	},

	methods: {
		onChangeUsername() {
			if (this.username == '') {
				this.usernameState = null;
				return;
			}

			const err =
				!this.username.match(/^[a-zA-Z0-9_]+$/) ? 'invalid-format' :
				this.username.length < 1 ? 'min-range' :
				this.username.length > 20 ? 'max-range' :
				null;

			if (err) {
				this.usernameState = err;
				return;
			}

			this.usernameState = 'wait';

			this.$root.api('username/available', {
				username: this.username,
			}).then(result => {
				this.usernameState = result.available ? 'ok' : 'unavailable';
			}).catch(err => {
				this.usernameState = 'error';
			});
		},

		onChangePassword() {
			if (this.password == '') {
				this.passwordStrength = '';
				return;
			}

			const strength = getPasswordStrength(this.password);
			this.passwordStrength = strength > 0.7 ? 'high' : strength > 0.3 ? 'medium' : 'low';
		},

		onChangePasswordRetype() {
			if (this.retypedPassword == '') {
				console.log('ここ', this.retypedPassword);
				this.passwordRetypeState = null;
				return;
			}
			console.log('ここ2', this.retypedPassword, this.password);
			this.passwordRetypeState = this.password == this.retypedPassword ? 'match' : 'not-match';
		},

		onSubmit() {
			if (this.submitting) return;
			this.submitting = true;

			this.$root.api('signup', {
				username: this.username,
				password: this.password,
				invitationCode: this.invitationCode,
				'hcaptcha-response': this.hCaptchaResponse,
				'g-recaptcha-response': this.reCaptchaResponse,
			}).then(() => {
				this.$root.api('signin', {
					username: this.username,
					password: this.password,
				}).then(res => {
					localStorage.setItem('i', res.i);
					document.cookie = `token=${res.i}; path=/; max-age=31536000`; // bull dashboardの認証とかで使う
					location.href = '/';
				});
			}).catch(() => {
				this.submitting = false;
				this.$refs.hcaptcha?.reset?.();
				this.$refs.recaptcha?.reset?.();

				this.$root.dialog({
					type: 'error',
					text: this.$t('some-error'),
				});
			});
		},
	},
});
</script> -->

<style lang="stylus" scoped>
.mk-signup
	min-width 302px
</style>
