<template>
<x-column>
	<template #header>
		<fa v-if="icon" :icon="icon"/>{{ title }}
	</template>

	<div>
		<component :is="component" v-bind="$attrs" @init="init"/>
	</div>
</x-column>
</template>

<script lang="ts">
import Vue from 'vue';
import XColumn from './deck.column.vue';

export default Vue.extend({
	components: {
		XColumn,
	},

	props: {
		component: {
			required: true,
		},
	},

	data() {
		return {
			title: null,
			icon: null,
		};
	},

	mounted() {
	},

	methods: {
		init(v) {
			this.title = v.title;
			this.icon = v.icon;
		},
	},
});
</script>
