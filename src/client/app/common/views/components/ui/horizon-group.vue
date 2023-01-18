<!--TODO: 廃止-->
<template>
<div class="vnxwkwuf" :class="{ inputs, noGrow }" :data-children-count="children">
	<slot></slot>
</div>
</template>

<script setup lang="ts">
import { nextTick, onMounted, provide, ref, useSlots } from 'vue';

const children = ref(0);
const slots = useSlots();

defineProps({
	inputs: {
		type: Boolean,
		required: false,
		default: false,
	},
	noGrow: {
		type: Boolean,
		required: false,
		default: false,
	},
});

provide('horizonGrouped', true);

onMounted(() => {
	nextTick(() => {
		children.value = slots.default.length;
	});
});

</script>

<script lang="ts">
/*
import { defineComponent } from 'vue';
export default defineComponent({
	provide: {
		horizonGrouped: true,
	},
	props: {
		inputs: {
			type: Boolean,
			required: false,
			default: false,
		},
		noGrow: {
			type: Boolean,
			required: false,
			default: false,
		},
	},
	data() {
		return {
			children: 0,
		};
	},
	mounted() {
		this.$nextTick(() => {
			this.children = this.$slots.default.length;
		});
	},
});
*/
</script>

<style lang="stylus" scoped>
.vnxwkwuf
	margin 16px 0

	&.inputs
		margin 32px 0

	&.fit-top
		margin-top 0

	&.fit-bottom
		margin-bottom 0

	&:not(.noGrow)
		display flex

		> *
			flex 1
			min-width 0 !important

	> *:not(:last-child)
		margin-right 16px !important

	&[data-children-count="3"]
		@media (max-width 600px)
			display block

			> *
				display block
				width 100% !important
				margin 16px 0 !important

				&:first-child
					margin-top 0 !important

				&:last-child
					margin-bottom 0 !important

</style>
