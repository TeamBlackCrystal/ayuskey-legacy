<template>
<div>
	<ui-card>
		<template #title><fa :icon="faBroadcastTower"/> {{ i18n.t('announcements') }}</template>
		<section v-for="(announcement, i) in announcements" class="fit-top">
			<ui-input v-model="announcement.title" @change="save">
				<span>{{ i18n.t('title') }}</span>
			</ui-input>
			<ui-textarea v-model="announcement.text">
				<span>{{ i18n.t('text') }}</span>
			</ui-textarea>
			<ui-input v-model="announcement.image">
				<span>{{ i18n.t('image-url') }}</span>
			</ui-input>
			<ui-horizon-group class="fit-bottom">
				<ui-button @click="save()"><fa :icon="['far', 'save']"/> {{ i18n.t('save') }}</ui-button>
				<ui-button @click="remove(i)"><fa :icon="['far', 'trash-alt']"/> {{ i18n.t('remove') }}</ui-button>
			</ui-horizon-group>
		</section>
		<section>
			<ui-button @click="add"><fa :icon="faPlus"/> {{ i18n.t('add') }}</ui-button>
		</section>
	</ui-card>
</div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { i18n as _i18n } from '../../i18n';
import { faBroadcastTower, faPlus } from '@fortawesome/free-solid-svg-icons';

export default defineComponent({
	data() {
		return {
			i18n: _i18n('admin/views/announcements.vue'),
			announcements: [],
			faBroadcastTower, faPlus,
		};
	},

	created() {
		this.$root.getMeta().then(meta => {
			this.announcements = meta.announcements;
		});
	},

	methods: {
		add() {
			this.announcements.unshift({
				title: '',
				text: '',
				image: null,
			});
		},

		remove(i) {
			this.$root.dialog({
				type: 'warning',
				text: this.i18n.t('_remove.are-you-sure').replace('$1', this.announcements.find((_, j) => j == i).title),
				showCancelButton: true,
			}).then(({ canceled }) => {
				if (canceled) return;
				this.announcements = this.announcements.filter((_, j) => j !== i);
				this.save(true);
				this.$root.dialog({
					type: 'success',
					text: this.i18n.t('_remove.removed'),
				});
			});
		},

		save(silent) {
			this.$root.api('admin/update-meta', {
				announcements: this.announcements,
			}).then(() => {
				if (!silent) {
					this.$root.dialog({
						type: 'success',
						text: this.i18n.t('saved'),
					});
				}
			}).catch(e => {
				this.$root.dialog({
					type: 'error',
					text: e,
				});
			});
		},
	},
});
</script>
