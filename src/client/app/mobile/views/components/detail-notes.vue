<template>
<div class="fdcvngpy">
	<div v-if="!notes.length" class="no-highlight">{{$t('@.featured-none')}}</div>
	<sequential-entrance animation="entranceFromTop" delay="25">
		<template v-for="note in notes" :key="note.id">
			<mk-note-detail class="post" :note="note"/>
		</template>
	</sequential-entrance>
	<ui-button v-if="more" @click="fetchMore()">{{ $t('@.load-more') }}</ui-button>
</div>
</template>

<script lang="ts">
import Vue from 'vue';
import i18n from '../../../i18n';
import paging from '../../../common/scripts/paging';

export default Vue.extend({
	i18n: i18n(),

	mixins: [
		paging({
			captureWindowScroll: true,
		}),
	],

	props: {
		pagination: {
			required: true,
		},
		extract: {
			required: false,
		},
	},

	computed: {
		notes() {
			return this.extract ? this.extract(this.items) : this.items;
		},
	},
});
</script>

<style lang="stylus" scoped>
.fdcvngpy
	> * > .post
		margin-bottom 8px

	@media (min-width 500px)
		> * > .post
			margin-bottom 16px

	> .no-highlight
		background var(--face)
		color var(--text)
		font-size 14px
		text-align center
		padding 32px
		border-radius 6px
</style>
