<template>
<div class="mk-notifications">
	<div class="placeholder" v-if="fetching">
		<template v-for="i in 10">
			<mk-note-skeleton :key="i"/>
		</template>
	</div>

	<div class="notifications" v-if="!empty">
		<!-- トランジションを有効にするとなぜかメモリリークする -->
		<component :is="!$store.state.device.reduceMotion ? 'transition-group' : 'div'" name="mk-notifications" class="transition" tag="div">
			<template v-for="(notification, i) in _notifications">
				<div class="notification" :class="notification.type" :key="notification.id">
					<template v-if="notification.type == 'reaction'">
						<mk-avatar class="avatar" :user="notification.user"/>
						<div class="text">
							<header>
								<router-link :to="notification.user | userPage" v-user-preview="notification.user.id" class="name">
									<mk-user-name :user="notification.user"/>
								</router-link>
								<mk-time :time="notification.createdAt"/>
							</header>
							<router-link class="note-ref" :to="notification.note | notePage" :title="getNoteSummary(notification.note)">
								<fa icon="quote-left"/>
									<mfm :text="getNoteSummary(notification.note)" :plain="true" :nowrap="true" :custom-emojis="notification.note.emojis"/>
								<fa icon="quote-right"/>
							</router-link>
						</div>
						<div class="sub-icon-border">
							<div class="sub-icon">
								<mk-reaction-icon :reaction="notification.reaction" :custom-emojis="notification.note.emojis" class="icon"/>
							</div>
						</div>
					</template>

					<template v-if="notification.type == 'renote'" style="position: relative;">
						<mk-avatar class="avatar" :user="notification.note.user"/>
						<div class="text">
							<header>
								<router-link :to="notification.note.user | userPage" v-user-preview="notification.note.userId" class="name">
									<mk-user-name :user="notification.note.user"/>
								</router-link>
								<mk-time :time="notification.createdAt"/>
							</header>
							<router-link class="note-ref" :to="notification.note | notePage" :title="getNoteSummary(notification.note.renote)">
								<fa icon="quote-left"/>
									<mfm :text="getNoteSummary(notification.note.renote)" :plain="true" :nowrap="true" :custom-emojis="notification.note.renote.emojis"/>
								<fa icon="quote-right"/>
							</router-link>
						</div>
						<div class="sub-icon">
								<fa icon="retweet" class="icon"/>
						</div>
					</template>

					<template v-if="notification.type == 'quote'">
						<mk-avatar class="avatar" :user="notification.note.user"/>
						<div class="text">
							<header>
								<router-link :to="notification.note.user | userPage" v-user-preview="notification.note.userId" class="name">
									<mk-user-name :user="notification.note.user"/>
								</router-link>
								<mk-time :time="notification.createdAt"/>
							</header>
							<router-link class="note-preview" :to="notification.note | notePage" :title="getNoteSummary(notification.note)">
								<mfm :text="getNoteSummary(notification.note)" :plain="true" :custom-emojis="notification.note.emojis"/>
							</router-link>
						</div>
						<div class="sub-icon">
							<fa icon="quote-left" class="icon"/>
						</div>
					</template>

					<template v-if="notification.type == 'follow'">
						<mk-avatar class="avatar" :user="notification.user"/>
						<div class="text">
							<header>
								<router-link :to="notification.user | userPage" v-user-preview="notification.user.id" class="name">
									<mk-user-name :user="notification.user"/>
								</router-link>
								<mk-time :time="notification.createdAt"/>
							</header>
						</div>
						<div class="sub-icon">
							<fa icon="user-plus" class="icon"/>
						</div>
					</template>

					<template v-if="notification.type == 'receiveFollowRequest'">
						<mk-avatar class="avatar" :user="notification.user"/>
						<div class="text">
							<header>
								<router-link :to="notification.user | userPage" v-user-preview="notification.user.id" class="name">
									<mk-user-name :user="notification.user"/>
								</router-link>
								<mk-time :time="notification.createdAt"/>
							</header>
						</div>
						<div class="sub-icon">
							<fa icon="user-clock" class="icon"/>
						</div>
					</template>

					<template v-if="notification.type == 'reply'">
						<mk-avatar class="avatar" :user="notification.note.user"/>
						<div class="text">
							<header>
								<router-link :to="notification.note.user | userPage" v-user-preview="notification.note.userId" class="name">
									<mk-user-name :user="notification.note.user"/>
								</router-link>
								<mk-time :time="notification.createdAt"/>
							</header>
							<router-link class="note-preview" :to="notification.note | notePage" :title="getNoteSummary(notification.note)">
								<mfm :text="getNoteSummary(notification.note)" :plain="true" :custom-emojis="notification.note.emojis"/>
							</router-link>
						</div>
						<div class="sub-icon">
							<fa icon="reply" class="icon"/>
						</div>
					</template>

					<template v-if="notification.type == 'mention'">
						<mk-avatar class="avatar" :user="notification.note.user"/>
						<div class="text">
							<header>
								<router-link :to="notification.note.user | userPage" v-user-preview="notification.note.userId" class="name">
									<mk-user-name :user="notification.note.user"/>
								</router-link>
								<mk-time :time="notification.createdAt"/>
							</header>
							<router-link class="note-preview" :to="notification.note | notePage" :title="getNoteSummary(notification.note)">
								<mfm :text="getNoteSummary(notification.note)" :plain="true" :custom-emojis="notification.note.emojis"/>
							</router-link>
						</div>
						<div class="sub-icon">
								<fa icon="at" class="icon"/>
						</div>
					</template>

					<template v-if="notification.type == 'pollVote'">
						<mk-avatar class="avatar" :user="notification.user"/>
						<div class="text">
							<header>
								<fa icon="chart-pie" class="icon"/>
								<router-link :to="notification.user | userPage" v-user-preview="notification.user.id" class="name">
									<mk-user-name :user="notification.user"/>
								</router-link>
								<mk-time :time="notification.createdAt"/>
							</header>
							<router-link class="note-ref" :to="notification.note | notePage" :title="getNoteSummary(notification.note)">
								<fa icon="quote-left"/>
									<mfm :text="getNoteSummary(notification.note)" :plain="true" :nowrap="true" :custom-emojis="notification.note.emojis"/>
								<fa icon="quote-right"/>
							</router-link>
						</div>
					</template>
				</div>

				<p class="date" v-if="i != items.length - 1 && notification._date != _notifications[i + 1]._date" :key="notification.id + '-time'">
					<span><fa icon="angle-up"/>{{ notification._datetext }}</span>
					<span><fa icon="angle-down"/>{{ _notifications[i + 1]._datetext }}</span>
				</p>
			</template>
		</component>
	</div>
	<button class="more" :class="{ fetching: moreFetching }" v-if="more" @click="fetchMore" :disabled="moreFetching">
		<template v-if="moreFetching"><fa icon="spinner" pulse fixed-width/></template>{{ moreFetching ? $t('@.loading') : $t('@.load-more') }}
	</button>
	<p class="empty" v-if="empty">{{ $t('empty') }}</p>
	<mk-error v-if="error" @retry="init()"/>
</div>
</template>

<script lang="ts">
import Vue from 'vue';
import i18n from '../../../i18n';
import getNoteSummary from '../../../../../misc/get-note-summary';
import paging from '../../../common/scripts/paging';
import * as config from '../../../config';

export default Vue.extend({
	i18n: i18n(),

	mixins: [
		paging({
			isContainer: true
		}),
	],

	props: {
		type: {
			type: String,
			required: false
		}
	},

	data() {
		return {
			connection: null,
			getNoteSummary,
			pagination: {
				endpoint: 'i/notifications',
				limit: 10,
				params: () => ({
					includeTypes: this.type ? [this.type] : undefined
				})
			}
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
		}
	},

	watch: {
		type() {
			this.reload();
		}
	},

	mounted() {
		this.connection = this.$root.stream.useSharedConnection('main');
		this.connection.on('notification', this.onNotification);
	},

	beforeDestroy() {
		this.connection.dispose();
	},

	methods: {
		onNotification(notification) {
			// TODO: ユーザーが画面を見てないと思われるとき(ブラウザやタブがアクティブじゃないなど)は送信しない
			this.$root.stream.send('readNotification', {
				id: notification.id
			});

			this.prepend(notification);

			// サウンドを再生する
			if (this.$store.state.device.enableSounds && this.$store.state.device.enableSoundsInNotifications) {
				const sound = new Audio(`${config.url}/assets/pope2.mp3`);
				sound.volume = this.$store.state.device.soundVolume;
				sound.play();
			}
		}
	}
});
</script>

<style lang="stylus" scoped>
.mk-notifications
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
		> div
			> .notification
				margin 0
				padding 16px
				overflow-wrap break-word
				font-size 12px
				border-bottom solid var(--lineWidth) var(--faceDivider)

				&:last-child
					border-bottom none

				&:after
					content ""
					display block
					clear both

				> .sub-icon-border
					padding 3px
					background #36d298

					> .sub-icon
						position: absolute;
						z-index: 1
						bottom: 1em
						width: 20px
						height: 20px
						box-sizing: border-box
						line-height: 20px
						border-radius: 50%
						font-size: 12px
						pointer-events: none
						left: 3em

						> .icon
							height: 100%;
							padding: 3px
							white-space nowrap
							text-overflow ellipsis
							display inline-block
							width: 100%
							overflow hidden

							[data-icon]
								font-size 1.2em
								font-weight normal
								font-style normal
								display inline-block

				> .avatar
					display block
					float left
					position -webkit-sticky
					position sticky
					top 16px
					width 36px
					height 36px
					border-radius 6px

				> .text
					float right
					width calc(100% - 36px)
					padding-left 8px
					> a
						color var(--noteText)
					> header
						display flex
						align-items baseline
						white-space nowrap

						/*旧アイコンのcss*/
						/*> .icon
							margin-right 4px*/

						> .name
							overflow hidden
							text-overflow ellipsis

						> .mk-time
							margin-left auto
							color var(--noteHeaderInfo)
							font-size 0.9em

				.note-preview
					color var(--noteText)
					display inline-block
					word-break break-word

				/*aaa*/

			> .reaction
				.sub-icon [data-icon]
					align-items normal

			> .renote, .quote
				.sub-icon [data-icon]
					color #77B255

			> .follow
				.sub-icon [data-icon]
					color #53c7ce

			> .ReceiveFollowRequest
				.sub-icon [data-icon]
					color #888

			> .reply, .mention
				.sub-icon [data-icon]
					color #555

			> .date
				display block
				margin 0
				line-height 32px
				text-align center
				font-size 0.8em
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
