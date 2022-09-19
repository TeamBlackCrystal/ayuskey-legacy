<template>
<div
	v-show="appearNote.deletedAt == null && !hideThisNote"
	v-hotkey="keymap"
	class="note"
	:tabindex="appearNote.deletedAt == null ? '-1' : null"
	:class="{ renote: isRenote, smart: $store.state.device.postStyle == 'smart', mini: narrow, 'note-reply-frame': appearNote.reply }"
>
	<x-sub v-for="note in conversation" :key="note.id" :note="note"/>
	<mk-renote v-if="isRenote" class="renote" :note="note" :class="{'reply-border': appearNote.reply}" />
	<div v-if="appearNote.reply && (!$store.getters.isSignedIn || $store.state.settings.showReplyTarget)" class="reply-to">
		<x-sub :note="appearNote.reply"/>
	</div>
	<article class="article" :class="{'reply-border': appearNote.reply}">
		<mk-avatar v-if="$store.state.device.postStyle != 'smart'" class="avatar" :user="appearNote.user"/>
		<div class="main">
			<mk-note-header class="header" :note="appearNote" :mini="true"/>
			<x-instance-ticker v-if="appearNote.user.instance && $store.state.device.instanceTicker != 'none'" :instance="appearNote.user.instance" />
			<div v-if="appearNote.deletedAt == null" class="body">
				<p v-if="appearNote.cw != null" class="cw">
					<mfm v-if="appearNote.cw != ''" class="text" :text="appearNote.cw" :author="appearNote.user" :i="$store.state.i" :custom-emojis="appearNote.emojis" />
					<mk-cw-button v-model="showContent" :note="appearNote"/>
				</p>
				<div v-show="appearNote.cw == null || showContent" class="content">
					<div class="text">
						<span v-if="appearNote.isHidden" style="opacity: 0.5">({{ $t('private') }})</span>
						<a v-if="appearNote.reply" class="reply"><fa icon="reply"/></a>
						<mfm v-if="appearNote.text" :text="appearNote.text" :author="appearNote.user" :i="$store.state.i" :custom-emojis="appearNote.emojis"/>
					</div>
					<div v-if="appearNote.files.length > 0" class="files">
						<mk-media-list :media-list="appearNote.files"/>
					</div>
					<mk-poll v-if="appearNote.poll" ref="pollViewer" :note="appearNote"/>
					<mk-url-preview v-for="url in urls" :key="url" :url="url" :compact="true"/>
					<a v-if="appearNote.geo" class="location" :href="`https://maps.google.com/maps?q=${appearNote.geo.coordinates[1]},${appearNote.geo.coordinates[0]}`" rel="noopener" target="_blank"><fa icon="map-marker-alt"/> {{ $t('location') }}</a>
					<div v-if="appearNote.renote" class="renote"><mk-note-preview :note="appearNote.renote"/></div>
				</div>
				<span v-if="appearNote.app && $store.state.settings.showVia" class="app">via <b>{{ appearNote.app.name }}</b></span>
			</div>
			<footer v-if="appearNote.deletedAt == null && !preview" class="footer">
				<mk-reactions-viewer ref="reactionsViewer" :note="appearNote"/>
				<button class="button" @click="reply()">
					<template v-if="appearNote.reply"><fa icon="reply-all"/></template>
					<template v-else><fa icon="reply"/></template>
					<p v-if="appearNote.repliesCount > 0" class="count">{{ appearNote.repliesCount }}</p>
				</button>
				<button v-if="['public', 'home'].includes(appearNote.visibility)" title="Renote" class="button" @click="renote()">
					<fa icon="retweet"/><p v-if="appearNote.renoteCount > 0" class="count">{{ appearNote.renoteCount }}</p>
				</button>
				<button v-else class="button">
					<fa icon="ban"/>
				</button>
				<button v-if="appearNote.myReaction == null" ref="reactButton" class="button" @click="react()">
					<fa icon="plus"/>
				</button>
				<button v-if="appearNote.myReaction != null" ref="reactButton" class="button reacted" @click="undoReact(appearNote)">
					<fa icon="minus"/>
				</button>
				<button ref="menuButton" class="button" @click="menu()">
					<fa icon="ellipsis-h"/>
				</button>
			</footer>
			<div v-if="appearNote.deletedAt != null" class="deleted">{{ $t('deleted') }}</div>
		</div>
	</article>
	<x-sub v-for="note in replies" :key="note.id" :note="note"/>
</div>
</template>

<script lang="ts">
import Vue from 'vue';
import i18n from '../../../i18n';

import XSub from './note.sub.vue';
import XInstanceTicker from '../../../common/views/components/instance-ticker.vue';
import noteMixin from '../../../common/scripts/note-mixin';
import noteSubscriber from '../../../common/scripts/note-subscriber';

export default Vue.extend({
	i18n: i18n('mobile/views/components/note.vue'),
	components: {
		XSub,
		XInstanceTicker,
	},

	mixins: [
		noteMixin({
			mobile: true,
		}),
		noteSubscriber('note'),
	],

	inject: {
		narrow: {
			default: false,
		},
	},

	props: {
		note: {
			type: Object,
			required: true,
		},
		detail: {
			type: Boolean,
			required: false,
			default: false,
		},
		preview: {
			type: Boolean,
			required: false,
			default: false,
		},
	},

	data() {
		return {
			conversation: [],
			replies: [],
		};
	},

	created() {
		if (this.detail) {
			this.$root.api('notes/children', {
				noteId: this.appearNote.id,
				limit: 30,
			}).then(replies => {
				this.replies = replies;
			});

			this.$root.api('notes/conversation', {
				noteId: this.appearNote.replyId,
			}).then(conversation => {
				this.conversation = conversation.reverse();
			});
		}
	},
	methods: {
		showTicker() {
			if (this.$store.state.device.instanceTicker === 'always') return true;
			if (this.$store.state.device.instanceTicker === 'remote' && this.appearNote.user.instance) return true;
			return false;
		},
	},
});
</script>

<style lang="css" scoped>
.reply-border {
	border-left: solid 2px var(--primary)
}

.note-reply-frame {
	border: solid 1px var(--primaryAlpha03) !important
}
</style>

<style lang="stylus" scoped>
.note
	overflow hidden
	font-size 13px
	border-radius 6px
	border-bottom solid var(--lineWidth) var(--faceDivider)

	&:last-of-type
		border-bottom none

	&:not(.mini)

		@media (min-width 350px)
			font-size 14px

		@media (min-width 500px)
			font-size 16px

		> .article
			@media (min-width 600px)
				padding 32px 32px 22px

			> .avatar
				@media (min-width 350px)
					width 48px
					height 48px
					border-radius 6px

				@media (min-width 500px)
					margin-right 16px
					width 58px
					height 58px
					border-radius 8px

			> .main
				> .header
					@media (min-width 500px)
						margin-bottom 2px

				> .body
					@media (min-width 700px)
						font-size 1.1em

	&.smart
		> .article
			> .main
				> header
					align-items center
					margin-bottom 4px

	> .renote + .article
		padding-top 8px

	> .article
		display flex
		padding 16px 16px 9px

		> .avatar
			flex-shrink 0
			display block
			margin 0 10px 8px 0
			width 42px
			height 42px
			border-radius 6px
			//position -webkit-sticky
			//position sticky
			//top 62px

		> .main
			flex 1
			min-width 0

			> .body
				> .cw
					cursor default
					display block
					margin 0
					padding 0
					overflow-wrap break-word
					color var(--noteText)

					> .text
						margin-right 8px

				> .content

					> .text
						display block
						margin 0
						padding 0
						overflow-wrap break-word
						color var(--noteText)
						font-size calc(1em + var(--fontSize))

						> .reply
							margin-right 8px
							color var(--noteText)

						> .rp
							margin-left 4px
							font-style oblique
							color var(--renoteText)

					.mk-url-preview
						margin-top 8px

					> .files
						> img
							display block
							max-width 100%

					> .location
						margin 4px 0
						font-size 12px
						color #ccc

					> .map
						width 100%
						height 200px

						&:empty
							display none

					> .mk-poll
						font-size 80%

					> .renote
						margin 8px 0

						> *
							padding 16px
							border dashed var(--lineWidth) var(--quoteBorder)
							border-radius 8px

				> .app
					font-size 12px
					color #ccc

			> .footer
				> .button
					margin 0
					padding 8px
					background transparent
					border none
					box-shadow none
					font-size 1em
					color var(--noteActions)
					cursor pointer

					&:not(:last-child)
						margin-right 28px

					&:hover
						color var(--noteActionsHover)

					> .count
						display inline
						margin 0 0 0 8px
						color var(--text)
						opacity 0.7

					&.reacted
						color var(--primary)

			> .deleted
				color var(--noteText)
				opacity 0.7

</style>
