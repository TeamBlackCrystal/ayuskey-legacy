<template>
<router-view id="app" v-hotkey.global="keymap"></router-view>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { url, lang } from './config';

export default defineComponent({
	computed: {
		keymap(): any {
			return {
				'h|slash': this.help,
				'd': this.dark,
			};
		},
	},

	methods: {
		help() {
			window.open(`${url}/docs/${lang}/keyboard-shortcut`, '_blank');
		},

		dark() {
			this.$store.commit('device/set', {
				key: 'darkmode',
				value: !this.$store.state.device.darkmode,
			});
		},
	},
});
</script>
