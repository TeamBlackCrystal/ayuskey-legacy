<template>
<div class="puqkfets" :class="{ mini: narrow }">
	<mk-avatar class="avatar" :user="note.user"/>
	<fa icon="retweet"/>
	<i18n path="@.renoted-by" tag="span">
		<router-link v-user-preview="note.userId" class="name" :to="note.user | userPage" place="user">
			<mk-user-name :user="note.user"/>
		</router-link>
	</i18n>
	<div class="info">
		<span v-if="note.viaMobile" class="mobile"><fa icon="mobile-alt"/></span>
		<mk-time :time="note.createdAt"/>
		<span v-if="note.visibility != 'public'" class="visibility">
			<fa v-if="note.visibility == 'home'" class="home" :title="$t('@.note-visibility.home')" icon="home"/>
			<fa v-if="note.visibility == 'followers'" class="followers" :title="$t('@.note-visibility.followers')" icon="lock"/>
			<fa v-if="note.visibility == 'specified'" class="specified" :title="$t('@.note-visibility.specified')" icon="envelope"/>
		</span>
		<span v-if="note.localOnly == true" class="localOnly" :title="$t('@.note-visibility.local-only')"><fa icon="heart"/></span>
	</div>
</div>
</template>

<script lang="ts">
import Vue from 'vue';
import i18n from '../../../i18n';

export default Vue.extend({
	i18n: i18n(),
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
	},
});
</script>

<style lang="stylus" scoped>
.puqkfets
	display flex
	align-items center
	padding 8px 16px
	line-height 28px
	white-space pre
	color var(--renoteText)
	background linear-gradient(to bottom, var(--renoteGradient) 0%, var(--face) 100%)

	&:not(.mini)
		padding 8px 16px

		@media (min-width 500px)
			padding 8px 16px

		@media (min-width 600px)
			padding 16px 32px 8px 32px

	> .avatar
		flex-shrink 0
		display inline-block
		width 28px
		height 28px
		margin 0 8px 0 0
		border-radius 6px

	> [data-icon]
		margin-right 4px

	> span
		overflow hidden
		flex-shrink 1
		text-overflow ellipsis
		white-space nowrap

		> .name
			font-weight bold

	> .info
		margin-left auto
		font-size 0.9em

		> .mobile
			margin-right 8px

		> .mk-time
			flex-shrink 0

		> .visibility
			margin-left 8px
			color var(--noteActionsReactionHover)

			[data-icon]
				margin-right 0

		> .localOnly
			margin-left 4px
			color var(--primary)

			[data-icon]
				margin-right 0

</style>
