<template>
<div class="modal">
	<div ref="bg" class="bg" :class="{'blur': $store.state.device.useBlur}" @click="onBgClick" />
	<slot class="main" />
</div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import anime from 'animejs';

export default defineComponent({
	props: {
		closeOnBgClick: {
			type: Boolean,
			required: false,
			default: true,
		},
		openAnimeDuration: {
			type: Number,
			required: false,
			default: 100,
		},
		closeAnimeDuration: {
			type: Number,
			required: false,
			default: 100,
		},
	},
	mounted() {
		anime({
			targets: this.$refs.bg,
			opacity: 1,
			duration: this.openAnimeDuration,
			easing: 'linear',
		});
	},
	methods: {
		onBgClick() {
			this.$emit('bg-click');
			if (this.closeOnBgClick) this.close();
		},
		close() {
			this.$emit('before-close');

			anime({
				targets: this.$refs.bg,
				opacity: 0,
				duration: this.closeAnimeDuration,
				easing: 'linear',
				complete: () => (this as any).destroyDom(),
			});
		},
	},
});
</script>

<style lang="stylus" scoped>
.modal
	position fixed
	z-index 2048
	top 0
	left 0
	width 100%
	height 100%

.bg
	display block
	position fixed
	z-index 1
	top 0
	left 0
	width 100%
	height 100%
	background rgba(#000, 0.7)
	opacity 0
.blur
	backdrop-filter blur(8px)

.main
	z-index 1
</style>
