<template>
<div>
	<ui-card>
		<ui-info warn>This is Insider Preview</ui-info>
	</ui-card>

	<ui-card>
		<template #title><fa :icon="faGrin"/> {{ $t('remoteEmojis') }}</template>
		<section style="padding: 16px 32px">
			<ui-horizon-group searchboxes>
				<!--
				<ui-input v-model="searchRemote" type="text" spellcheck="false" @input="fetchEmojis('remote', true)">
					<span>{{ $t('name') }}</span>
				</ui-input>
				-->
				<ui-input v-model="searchHost" type="text" spellcheck="false" @input="fetchEmojis('remote', true)">
					<span>{{ $t('host') }}</span>
				</ui-input>
			</ui-horizon-group>
		</section>

		<section v-for="emoji in remoteEmojis" :key="emoji.id" class="remotebft" style="padding: 16px 32px">
			<div class="image">
				<img :src="emoji.url" :alt="emoji.name" style="width: 32px;"/>
			</div>
			<div class="detail">
				<div style="margin-bottom: 0.5em;">{{ `${emoji.name}@${emoji.host}` }}</div>
				<ui-button @click="copy(emoji.id)">{{ $t('copy') }}</ui-button>
			</div>
		</section>
	</ui-card>

</div>
</template>

<script lang="ts">
import Vue from 'vue';
import i18n from '../../i18n';
import { faGrin } from '@fortawesome/free-regular-svg-icons';
import { unique } from '@prelude/array';
export default Vue.extend({
	i18n: i18n('admin/views/emoji.vue'),
	data() {
		return {
			name: '',
			category: '',
			url: '',
			aliases: '',
			limit: 10,
			remoteLimit: 50,
			emojis: [],
			existMore: false,
			offset: 0,
			remoteEmojis: [],
			remoteExistMore: false,
			remoteOffset: 0,
			searchLocal: '',
			searchRemote: '',
			searchHost: '',
			origin: 'all',
			faGrin,
		};
	},
	computed: {
		categoryList() {
			return unique(this.emojis.map((x: any) => x.category || '').filter((x: string) => x !== ''));
		},
	},
	watch: {
		origin() {
			this.fetchEmojis('remote', true);
		},
	},
	mounted() {
		this.fetchEmojis();
	},
	methods: {
		copy(id: any) {
			this.$root.api('admin/emoji/copy', {
				emojiId: id,
			}).then(() => {
				this.fetchEmojis('local', true);
				this.fetchEmojis('remote', true);
				this.$root.dialog({
					type: 'success',
					text: this.$t('copied'),
				});
			}).catch(e => {
				this.$root.dialog({
					type: 'error',
					text: e,
				});
			});
		},
		fetchEmojis(kind?: string, truncate?: boolean) {
			if (!kind || kind === 'remote') {
				if (truncate) this.remoteOffset = 0;
				this.$root.api('admin/emoji/list', {
					remote: true,
					name: this.searchRemote,
					host: this.searchHost || undefined,
					offset: this.remoteOffset,
					limit: this.remoteLimit + 1,
				}).then((emojis: any[]) => {
					if (emojis.length === this.remoteLimit + 1) {
						emojis.pop();
						this.remoteExistMore = true;
					} else {
						this.remoteExistMore = false;
					}
					this.remoteEmojis = emojis;
					this.remoteOffset += emojis.length;
				});
			}
		},
	},
});
</script>

<style lang="stylus" scoped>
.oryfrbft
	@media (min-width 500px)
		display flex
	> div:first-child
		@media (max-width 500px)
			padding-bottom 16px
		> img
			vertical-align bottom
	> div:last-child
		flex 1
		@media (min-width 500px)
			padding-left 16px
.remotebft
	display flex
	> div.image
		padding-bottom 16px
		> img
			vertical-align bottom
	> div.detail
		flex 1
		padding-left 16px
</style>
