<template>
	<div class="uptimes">
		<p>Uptimes</p>
		<p>Process: {{ process }}</p>
		<p>OS: {{ os }}</p>
	</div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, ref } from "vue";
import formatUptime from "../../scripts/format-uptime";
import Stream from "../../scripts/stream";

const { connection } = defineProps({ connection: { type: Stream } });

let process = ref(0);
let os = ref(0);

const onStats = (stats) => {
	process.value = formatUptime(stats.process_uptime);
	os.value = formatUptime(stats.os_uptime);
};

onMounted(() => {
	connection.on("stats", onStats);
});

onUnmounted(() => {
	connection.off("stats", onStats);
});
</script>

<style lang="stylus" scoped>
.uptimes
	padding 10px 14px

	> p
		margin 0
		font-size 12px
		color var(--text)

		&:first-child
			font-weight bold
</style>
