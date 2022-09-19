<template>
<div v-if="!fetching" class="mwermpua">
	<sequential-entrance animation="entranceFromTop" delay="25">
		<slot :items="items"></slot>
	</sequential-entrance>
	<div v-if="more" class="more">
		<ui-button @click="fetchMore()">{{ $t('@.load-more') }}</ui-button>
	</div>
</div>
</template>

<script lang="ts">
import Vue from 'vue';
import paging from '../../../scripts/paging';

export default Vue.extend({
	mixins: [
		paging({
			captureWindowScroll: false,
		}),
	],

	props: {
		pagination: {
			required: true,
		},
	},
});
</script>

<style lang="stylus" scoped>
.mwermpua
	> .more
		margin-top 16px

</style>
