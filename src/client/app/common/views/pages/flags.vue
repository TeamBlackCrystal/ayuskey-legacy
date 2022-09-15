<template>
<div class="body-container">
	<ui-card>
		<template #title>Experiments</template>
		<section>
			<ui-info warn>警告: 試験運用の機能です。これらの機能を有効にすると、Misskeyが正しく動作しなくなる可能性があります。また、ここにあるすべての機能が動作するわけではありません。</ui-info>
		</section>
	</ui-card>

	<ui-card>
		<template #title>アカウント設定</template>
		<section>
			<p>なし</p>
		</section>
	</ui-card>

	<ui-card>
		<template #title>クライアント設定</template>
		<section>
			<header>{{ $t('@._settings.instance-ticker') }}</header>
			<ui-radio v-model="instanceTicker" value="none">{{ $t('@._settings.instance-ticker-none') }}</ui-radio>
			<ui-radio v-model="instanceTicker" value="remote">{{ $t('@._settings.instance-ticker-remote') }}</ui-radio>
			<ui-radio v-model="instanceTicker" value="always">{{ $t('@._settings.instance-ticker-always') }}</ui-radio>
		</section>
	</ui-card>
</div>
</template>

<script>
import Vue from 'vue';
import i18n from '../../../i18n';

export default Vue.extend({
	i18n: i18n(),
	data() {
		return {
		}
	},
	computed: {
		instanceTicker: {
			get() { return this.$store.state.device.instanceTicker; },
			set(value) { this.$store.commit('device/set', { key: 'instanceTicker', value }); }
		},
	}
});
</script>

<style scoped>
.body-container {
	--side-padding: 20px;
	display: flex;
	flex: 1;
	flex-direction: column;
	margin: 0 auto;
	max-width: calc(700px + 2 * var(--side-padding));
	width: 100%;
}
</style>
