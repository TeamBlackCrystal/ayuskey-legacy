<template>
<div class="oxynyeqmfvracxnglgulyqfgqxnxmehl">
	<div v-if="fetching" class="placeholder">
		<template v-for="i in 10">
			<mk-note-skeleton :key="i"/>
		</template>
	</div>

	<!-- トランジションを有効にするとなぜかメモリリークする -->
	<component :is="!$store.state.device.reduceMotion ? 'transition-group' : 'div'" name="mk-notifications" class="transition notifications" tag="div">
		<template v-for="(notification, i) in _notifications">
			<x-notification :key="notification.id" class="notification" :notification="notification"/>
			<p v-if="i != items.length - 1 && notification._date != _notifications[i + 1]._date" :key="notification.id + '-time'" class="date">
				<span><fa icon="angle-up"/>{{ notification._datetext }}</span>
				<span><fa icon="angle-down"/>{{ _notifications[i + 1]._datetext }}</span>
			</p>
		</template>
	</component>
	<button v-if="more" class="more" :class="{ fetching: moreFetching }" :disabled="moreFetching" @click="fetchMore">
		<template v-if="moreFetching"><fa icon="spinner" pulse fixed-width/></template>{{ moreFetching ? $t('@.loading') : $t('@.load-more') }}
	</button>
	<p v-if="empty" class="empty">{{ $t('empty') }}</p>
	<mk-error v-if="error" @retry="init()"/>
</div>
</template>

<script lang="ts">
import Vue from 'vue';
import i18n from '../../../i18n';
import * as sound from '../../scripts/sound';
import XNotification from './deck.notification.vue';
import paging from '../../../common/scripts/paging';
import * as config from '../../../config';
import { stream } from '../../../stream';

const displayLimit = 20;

export default Vue.extend({
	i18n: i18n(),

	components: {
		XNotification,
	},

	inject: ['column', 'isScrollTop', 'count'],

	mixins: [
		paging({
			onQueueChanged: (self, q) => {
				self.count(q.length);
			},
		}),
	],

	props: {
		type: {
			type: String,
			required: false,
		},
	},

	data() {
		return {
			connection: null,
			pagination: {
				endpoint: 'i/notifications',
				limit: 20,
				params: () => ({
					includeTypes: this.type ? [this.type] : undefined,
				}),
			},
		};
	},

	computed: {
		_notifications(): any[] {
			return (this.items as any).map(notification => {
				const date = new Date(notification.createdAt).getDate();
				const month = new Date(notification.createdAt).getMonth() + 1;
				notification._date = date;
				notification._datetext = this.$t('@.month-and-day').replace('{month}', month.toString()).replace('{day}', date.toString());
				return notification;
			});
		},
	},

	watch: {
		type() {
			this.reload();
		},
	},

	mounted() {
		this.connection = stream.useChannel('main');
		this.connection.on('notification', this.onNotification);

		this.column.$on('top', this.onTop);
		this.column.$on('bottom', this.onBottom);
	},

	beforeDestroy() {
		this.connection.dispose();

		this.column.$off('top', this.onTop);
		this.column.$off('bottom', this.onBottom);
	},

	methods: {
		onNotification(notification) {
			// TODO: ユーザーが画面を見てないと思われるとき(ブラウザやタブがアクティブじゃないなど)は送信しない
			stream.send('readNotification', {
				id: notification.id,
			});

			// サウンドを再生する
			if (this.$store.state.device.enableSounds && this.$store.state.device.enableSoundsInNotifications) {
				sound.play('notification');
			}
		},
	},
});
</script>

<style lang="stylus" scoped>
.oxynyeqmfvracxnglgulyqfgqxnxmehl
	.transition
		.mk-notifications-enter
		.mk-notifications-leave-to
			opacity 0
			transform translateY(-30px)

		> *
			transition transform .3s ease, opacity .3s ease

	> .placeholder
		padding 16px
		opacity 0.3

	> .notifications

		> .notification:not(:last-child)
			border-bottom solid var(--lineWidth) var(--faceDivider)

		> .date
			display block
			margin 0
			line-height 28px
			text-align center
			font-size 12px
			color var(--dateDividerFg)
			background var(--dateDividerBg)
			border-bottom solid var(--lineWidth) var(--faceDivider)

			span
				margin 0 16px

			[data-icon]
				margin-right 8px

	> .more
		display block
		width 100%
		padding 16px
		color var(--text)
		border-top solid var(--lineWidth) rgba(#000, 0.05)

		&:hover
			background rgba(#000, 0.025)

		&:active
			background rgba(#000, 0.05)

		&.fetching
			cursor wait

		> [data-icon]
			margin-right 4px

	> .empty
		margin 0
		padding 16px
		text-align center
		color var(--text)

</style>
