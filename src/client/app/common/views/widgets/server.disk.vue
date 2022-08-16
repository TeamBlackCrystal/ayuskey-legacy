<template>
	<div class="disk">
		<x-pie class="pie" :value="usage" />
		<div>
			<p><fa :icon="['far', 'hdd']" />Storage</p>
			<p>Total: {{ total | bytes(1) }}</p>
			<p>Free: {{ available | bytes(1) }}</p>
			<p>Used: {{ used | bytes(1) }}</p>
		</div>
	</div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, ref } from "vue";
import Stream from "../../scripts/stream";
import XPie from "./server.pie.vue";

const props = defineProps({
	connection: {
		type: Stream,
	},
});

let usage = ref(0);
let total = ref(0);
let used = ref(0);
let available = ref(0);

const onStats = (stats) => {
	stats.disk.used = stats.disk.total - stats.disk.free;
	usage.value = stats.disk.used / stats.disk.total;
	total.value = stats.disk.total;
	used.value = stats.disk.used;
	available.value = stats.disk.available;
};

onMounted(() => {
	props.connection.on("stats", onStats);
});
onUnmounted(() => {
	props.connection.off("stats", onStats);
});
</script>

<style lang="stylus" scoped>
.disk
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
