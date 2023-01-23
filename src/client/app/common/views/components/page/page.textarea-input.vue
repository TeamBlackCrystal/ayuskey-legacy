<template>
<div>
	<ui-textarea v-model="v" class="">{{ script.interpolate(value.text) }}</ui-textarea>
</div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
	props: {
		value: {
			required: true,
		},
		script: {
			required: true,
		},
	},

	data() {
		return {
			v: this.value.default,
		};
	},

	watch: {
		v() {
			this.script.aiScript.updatePageVar(this.value.name, this.v);
			this.script.eval();
		},
	},
});
</script>

<style lang="stylus" scoped>
</style>
