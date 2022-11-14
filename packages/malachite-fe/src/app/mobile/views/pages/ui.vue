<template>
<mk-ui>
	<template #header><span v-if="icon" style="margin-right:4px;"><fa :icon="icon"/></span>{{ title }}</template>

	<main>
		<component :is="component" v-bind="$attrs" @init="init"/>
	</main>
</mk-ui>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
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
