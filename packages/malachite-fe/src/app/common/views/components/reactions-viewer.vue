<template>
<div class="mk-reactions-viewer">
	<x-reaction v-for="(count, reaction) in note.reactions" :key="reaction" :reaction="reaction" :count="count" :is-initial="initialReactions.has(reaction)" :note="note"/>
</div>
</template>

<script lang="ts">
import Vue from 'vue';
import XReaction from './reactions-viewer.reaction.vue';

export default Vue.extend({
	components: {
		XReaction,
	},
	props: {
		note: {
			type: Object,
			required: true,
		},
	},
	data() {
		return {
			initialReactions: new Set(Object.keys(this.note.reactions)),
		};
	},
});
</script>

<style lang="stylus" scoped>
.mk-reactions-viewer
	margin: 4px -2px

	&:empty
		display none

</style>
