<template>
<div class="memory">
	<x-pie class="pie" :value="usage" />
	<div>
		<p><fa icon="memory" />Memory</p>
		<p>Total: {{ total | bytes(1) }}</p>
		<p>Used: {{ used | bytes(1) }}</p>
		<p>Free: {{ free | bytes(1) }}</p>
	</div>
</div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue';
import Stream from '../../scripts/stream';
import XPie from './server.pie.vue';

const { connection } = defineProps({ connection: { type: Stream } });
let usage = ref(0);
let total = ref(0);
let used = ref(0);
let free = ref(0);

const onStats = (stats) => {
	stats.mem.free = stats.mem.total - stats.mem.used;
	usage.value = stats.mem.used / stats.mem.total;
	total.value = stats.mem.total;
	used.value = stats.mem.used;
	free.value = stats.mem.free;
};

onMounted(() => {
	connection.on('stats', onStats);
});
onUnmounted(() => {
	connection.off('stats', onStats);
});
</script>

<style lang="stylus" scoped>
.memory
	> .pie
		padding 10px
		height 100px
		float left

	> div
		float left
		width calc(100% - 100px)
		padding 10px 10px 10px 0

		> p
			margin 0
			font-size 12px
			color var(--chartCaption)

			&:first-child
				font-weight bold

				> [data-icon]
					margin-right 4px

	&:after
		content ""
		display block
		clear both
</style>
