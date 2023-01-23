<template>
<div v-show="script.vars[value.var]">
	<x-block v-for="child in value.children" :key="child.id" :value="child" :page="page" :script="script" :h="h"/>
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
		page: {
			required: true,
		},
		h: {
			required: true,
		},
	},

	beforeCreate() {
		this.$options.components.XBlock = require('./page.block.vue').default;
	},
});
</script>
