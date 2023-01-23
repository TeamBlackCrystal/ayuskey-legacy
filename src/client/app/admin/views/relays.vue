<template>
<div>
	<ui-card>
		<template #title><fa icon="plus"/> {{ i18n.t('add-relay') }}</template>
		<section class="fit-top">
			<ui-horizon-group inputs>
				<ui-input v-model="inbox">
					<span>{{ i18n.t('inbox') }}</span>
				</ui-input>
			</ui-horizon-group>
			<ui-button @click="add(inbox)">{{ i18n.t('add') }}</ui-button>
		</section>
	</ui-card>

	<ui-card>
		<template #title><fa :icon="faProjectDiagram"/> {{ i18n.t('added-relays') }}</template>
		<section v-for="relay in relays" :key="relay.inbox" class="relayath">
			<div>{{ relay.inbox }}</div>
			<div>{{ i18n.t(`status.${relay.status}`) }}</div>
			<ui-button @click="remove(relay.inbox)">{{ i18n.t('remove') }}</ui-button>
		</section>
	</ui-card>
</div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { i18n as _i18n } from '../../i18n';
import { faProjectDiagram } from '@fortawesome/free-solid-svg-icons';

export default defineComponent({
	data() {
		return {
			i18n: _i18n('admin/views/relay.vue'),
			relays: [],
			inbox: '',
			faProjectDiagram,
		};
	},

	computed: {
	},

	created() {
		this.reload();
	},

	methods: {
		add(inbox: string) {
			this.$root.api('admin/relays/add', {
				inbox,
			}).then((relay: any) => {
				this.inbox = '';
				this.reload();
			}).catch((e: any) => {
				this.$root.dialog({
					type: 'error',
					text: e.message || e,
				});
			});
		},

		remove(inbox: string) {
			this.$root.api('admin/relays/remove', {
				inbox,
			}).then(() => {
				this.reload();
			}).catch((e: any) => {
				this.$root.dialog({
					type: 'error',
					text: e.message || e,
				});
			});
		},

		reload() {
			this.$root.api('admin/relays/list').then((relays: any) => {
				this.relays = relays;
			});
		},
	},
});
</script>

<style lang="stylus" scoped>
.relayath
	> div
		margin 0.3em
</style>
