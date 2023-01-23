<script setup lang="ts">
import { defineAsyncComponent, Ref, ref } from 'vue';
import { toUnicode } from 'punycode';

import { host } from '../../../config';
import { i18n as _i18n } from '../../../i18n';
import { api } from '../../../api';
import { api as _api } from '../../../os';

import uiInput from './ui/input.vue';
import { LiteInstanceMetadata } from 'ayuskey.js/built/entities';
const captcha = defineAsyncComponent(() => import('./captcha.vue').then(x => x.default));

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
const meta: Ref<LiteInstanceMetadata> = ref({} as LiteInstanceMetadata);
const submitting = ref(false);
const ToSAgreement = false;
const reCaptchaResponse = null;
const hCaptchaResponse = null;

const hcaptchaRef = ref<HTMLElement>();
const recaptchaRef = ref<HTMLElement>();

api.request('meta', {}).then((res) => {
	meta.value = res;
});

function onSubmit() {
	if (submitting.value) return;
	submitting.value = true;

	_api('signup', {
		username: username.value,
		password: password.value,
		invitationCode: invitationCode,
		'hcaptcha-response': hCaptchaResponse,
		'g-recaptcha-response': reCaptchaResponse,
	}).then(() => {
		_api('signin', {
			username: username.value,
			password: password.value,
		}).then(res => {
			localStorage.setItem('i', res.i);
			document.cookie = `token=${res.i}; path=/; max-age=31536000`; // bull dashboardの認証とかで使う
			location.href = '/';
		});
	}).catch(() => {
		submitting.value = false;
		hcaptchaRef.value.reset?.(); // TODO: 今後どこにresetがあるか探す
		recaptchaRef.value.reset?.();

		this.$root.dialog({
			type: 'error',
			text: i18n.t('some-error'),
		});
	});
}

function onChangeUsername(value) {
	username.value = value;
	if (username.value === '') {
		usernameState.value = null;
		return;
	}

	const err = !username.value.match(/^[a-zA-Z0-9_]+$/)
		? 'invalid-format'
		: username.value.length < 1
			? 'min-range'
			: username.value.length > 20
				? 'max-range'
				: null;

	if (err) {
		usernameState.value = err;
		return;
	}

	usernameState.value = 'wait';

	api
		.request('username/available', {
			params: { username: username.value },
		})
		.then((result) => {
			usernameState.value = result.available ? 'ok' : 'unavailable';
		})
		.catch((err) => {
			usernameState.value = 'error';
		});
}

function onChangePassword(value) {
	password.value = value;
	if (password.value === '') {
		passwordStrength.value = '';
		return;
	}

	const strength = getPasswordStrength(password);
	passwordStrength.value =
		strength > 0.7 ? 'high' : strength > 0.3 ? 'medium' : 'low';
}

function onChangePasswordRetype(value) {
	retypedPassword.value = value;
	if (retypedPassword.value === '') {
		passwordRetypeState.value = null;
		return;
	}
	console.log('ここ2', retypedPassword, password);
	passwordRetypeState.value =
		password.value === retypedPassword.value ? 'match' : 'not-match';
}
</script>

<template>
<form
	class="mk-signup"
	:autocomplete="Math.random()"
	@submit.prevent="onSubmit"
>
	<template v-if="meta">
		<uiInput
			v-if="meta.disableRegistration"
			v-model="invitationCode"
			type="text"
			:spellcheck="false"
			required
			styl="fill"
		>
			<span>{{ i18n.t("invitation-code") }}</span>
			<template #prefix><fa icon="id-card-alt" /></template>
			<template #desc>
				{{i18n
					.t('invitation-info')}}
			</template>
		</uiInput>
		<uiInput
			:model-value="username"
			type="text"
			pattern="^[a-zA-Z0-9_]{1,20}$"
			autocomplete="username"
			:spellcheck="false"
			required
			styl="fill"
			@update:model-value="onChangeUsername"
		>
			<span>{{ i18n.t("username") }}</span>
			<template #prefix>@</template>
			<template #suffix>@{{ unicodeHost }}</template>
			<template #desc>
				<span v-if="usernameState == 'wait'" style="color: #999"
				><fa icon="spinner" pulse fixed-width />
					{{ i18n.t("checking") }}</span
				>
				<span v-if="usernameState == 'ok'" style="color: #3cb7b5"
				><fa icon="check" fixed-width /> {{ i18n.t("available") }}</span
				>
				<span v-if="usernameState == 'unavailable'" style="color: #ff1161"
				><fa icon="exclamation-triangle" fixed-width />
					{{ i18n.t("unavailable") }}</span
				>
				<span v-if="usernameState == 'error'" style="color: #ff1161"
				><fa icon="exclamation-triangle" fixed-width />
					{{ i18n.t("error") }}</span
				>
				<span v-if="usernameState == 'invalid-format'" style="color: #ff1161"
				><fa icon="exclamation-triangle" fixed-width />
					{{ i18n.t("invalid-format") }}</span
				>
				<span v-if="usernameState == 'min-range'" style="color: #ff1161"
				><fa icon="exclamation-triangle" fixed-width />
					{{ i18n.t("too-short") }}</span
				>
				<span v-if="usernameState == 'max-range'" style="color: #ff1161"
				><fa icon="exclamation-triangle" fixed-width />
					{{ i18n.t("too-long") }}</span
				>
			</template>
		</uiInput>
		<uiInput
			:model-value="password"
			type="password"
			autocomplete="new-password"
			required
			:with-password-meter="true"
			styl="fill"
			@update:model-value="onChangePassword"
		>
			<span>{{ i18n.t("password") }}</span>
			<template #prefix><fa icon="lock" /></template>
			<template #desc>
				<p v-if="passwordStrength == 'low'" style="color: #ff1161">
					<fa icon="exclamation-triangle" fixed-width />
					{{ i18n.t("weak-password") }}
				</p>
				<p v-if="passwordStrength == 'medium'" style="color: #3cb7b5">
					<fa icon="check" fixed-width /> {{ i18n.t("normal-password") }}
				</p>
				<p v-if="passwordStrength == 'high'" style="color: #3cb7b5">
					<fa icon="check" fixed-width /> {{ i18n.t("strong-password") }}
				</p>
			</template>
		</uiInput>
		<uiInput
			:model-value="retypedPassword"
			type="password"
			autocomplete="current-password"
			required
			styl="fill"
			@update:model-value="onChangePasswordRetype"
		>
			<span>{{ i18n.t("password") }} ({{ i18n.t("retype") }})</span>
			<template #prefix><fa icon="lock" /></template>
			<template #desc>
				<p v-if="passwordRetypeState == 'match'" style="color: #3cb7b5">
					<fa icon="check" fixed-width /> {{ i18n.t("password-matched") }}
				</p>
				<p v-if="passwordRetypeState == 'not-match'" style="color: #ff1161">
					<fa icon="exclamation-triangle" fixed-width />
					{{ i18n.t("password-not-matched") }}
				</p>
			</template>
		</uiInput>
		<ui-switch v-if="meta.ToSUrl" v-model="ToSAgreement">
			<i18n path="agree-to">
				<a :href="meta.ToSUrl" target="_blank">{{ i18n.t("tos") }}</a>
			</i18n>
		</ui-switch>
		<captcha
			v-if="meta.enableRecaptcha"
			ref="recaptchaRef"
			v-model="reCaptchaResponse"
			class="captcha"
			provider="grecaptcha"
			:sitekey="meta.recaptchaSiteKey"
		/>
		<captcha
			v-if="meta.enableHcaptcha"
			ref="hcaptchaRef"
			v-model="hCaptchaResponse"
			class="captcha"
			provider="hcaptcha"
			:sitekey="meta.hcaptchaSiteKey"
		/>
		<ui-button
			type="submit"
			:disabled="
				submitting ||
					!(meta.ToSUrl ? ToSAgreement : true) ||
					passwordRetypeState == 'not-match'
			"
		>{{ i18n.t("create") }}</ui-button
		>
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
					text: this.i18n.t('some-error'),
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
