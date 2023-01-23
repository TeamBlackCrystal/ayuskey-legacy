<template>
<mk-window ref="window" is-modal :animation="animation" @closed="onWindowClosed">
	<template #header :class="$style.header"><fa icon="retweet"/>{{ $t('title') }}</template>
	<mk-renote-form ref="form" v-hotkey.global="keymap" :note="note" @posted="onPosted" @canceled="onCanceled"/>
</mk-window>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import i18n from '../../../i18n';

export default defineComponent({
	i18n: i18n('desktop/views/components/renote-form-window.vue'),
	props: {
		note: {
			type: Object,
			required: true,
		},

		animation: {
			type: Boolean,
			required: false,
			default: true,
		},
	},

	computed: {
		keymap(): any {
			return {
				'esc': this.close,
				'enter': this.post,
				'q': this.quote,
			};
		},
	},

	methods: {
		post() {
			(this.$refs.form as any).ok();
		},
		quote() {
			(this.$refs.form as any).onQuote();
		},
		close() {
			(this.$refs.window as any).close();
		},
		onPosted() {
			(this.$refs.window as any).close();
		},
		onCanceled() {
			(this.$refs.window as any).close();
		},
		onWindowClosed() {
			this.$emit('closed');
			this.destroyDom();
		},
	},
});
</script>

<style lang="stylus" module>
.header
	> [data-icon]
		margin-right 4px

</style>
