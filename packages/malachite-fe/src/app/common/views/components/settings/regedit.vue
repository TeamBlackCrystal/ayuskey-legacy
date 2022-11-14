<template>
<div>
	<details>
		<summary>RegEdit (wip)</summary>
		<section>
			<!--<ui-info warn>{{ $t('editTheseSettingsMayBreakAccount') }}</ui-info>-->
			<ui-info warn>Read only</ui-info>
		</section>
		<section>
			<template>Account</template>
			<ui-textarea :value="settings" code tall></ui-textarea>
			<!--<ui-button @click="saveSettings">Save</ui-button>-->
		</section>
		<section>
			<template>Device</template>
			<ui-textarea :value="deviceSettings" code tall></ui-textarea>
			<!--<ui-button @click="saveDeviceSettings">Save</ui-button>-->
		</section>
		<!--
		<section>
			<template>Device (per account)</title>
			<ui-textarea :value="deviceUserSettings" code tall></ui-textarea>
			<ui-button @click="saveDeviceUserSettings">Save</ui-button>
		</section>
		-->
	</details>
</div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { faCode } from '@fortawesome/free-solid-svg-icons';
import * as JSON5 from 'json5';
//import * as os from '@/os';
export default defineComponent({
	emits: ['info'],
	data() {
		return {
			INFO: {
				title: 'RegEdit',
				icon: faCode,
			},
			settings: JSON5.stringify(this.$store.state.settings, null, '\t'),
			deviceSettings: JSON5.stringify(this.$store.state.device, null, '\t'),
			//deviceUserSettings: JSON5.stringify(this.$store.state.deviceUser, null, '\t'),
		};
	},
	mounted() {
		this.$emit('info', this.INFO);
	},
	methods: {
		saveDeviceSettings() {
			const obj = JSON5.parse(this.deviceSettings);
			this.$store.commit('device/overwrite', obj);
		},/*
		saveDeviceUserSettings() {
			const obj = JSON5.parse(this.deviceUserSettings);
			this.$store.commit('deviceUser/overwrite', obj);
		},*/
	},
});
</script>
