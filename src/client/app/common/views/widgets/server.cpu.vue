<template>
<div class="cpu">
	<x-pie class="pie" :value="usage"/>
	<div>
		<p><fa icon="microchip"/>CPU</p>
		<p>{{ meta.cpu.cores }} Logical cores</p>
		<p>{{ meta.cpu.model }}</p>
	</div>
</div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue';
import Stream from '../../scripts/stream';
import XPie from './server.pie.vue';

const props = defineProps({
	connection: { type: Stream },
	meta: { type: Object },
});

let usage = ref(0);

const onStats = (stats) => {
	usage.value = stats.cpu_usage;
};

onMounted(() => {
	props.connection.on('stats', onStats);
}),
onUnmounted(() => {
	props.connection.off('stats', onStats);
});
</script>

<style lang="stylus" scoped>
.cpu
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
