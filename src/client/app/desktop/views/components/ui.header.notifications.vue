<template>
<div v-hotkey.global="keymap" class="notifications">
	<button :data-active="isOpen" :title="i18n.t('title')" @click="toggle">
		<i class="bell"><fa :icon="['far', 'bell']"/></i>
		<i v-if="hasUnreadNotification" class="circle"><fa icon="circle"/></i>
	</button>
	<div v-if="isOpen" class="pop" :class="{'blur': $store.state.device.useBlur}">
		<mk-notifications/>
	</div>
</div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { i18n as _i18n } from '../../../i18n';
import contains from '../../../common/scripts/contains';

export default defineComponent({
	compatConfig: {
		MODE: 3,
	},
	data() {
		return {
			i18n: _i18n('desktop/views/components/ui.header.notifications.vue'),
			isOpen: false,
		};
	},

	computed: {
		hasUnreadNotification(): boolean {
			return this.$store.getters.isSignedIn && this.$store.state.i.hasUnreadNotification;
		},

		keymap(): any {
			return {
				'shift+n': this.toggle,
			};
		},
	},

	methods: {
		toggle() {
			this.isOpen ? this.close() : this.open();
		},

		open() {
			this.isOpen = true;
			for (const el of Array.from(document.querySelectorAll('body *'))) {
				el.addEventListener('mousedown', this.onMousedown);
			}
		},

		close() {
			this.isOpen = false;
			for (const el of Array.from(document.querySelectorAll('body *'))) {
				el.removeEventListener('mousedown', this.onMousedown);
			}
		},

		onMousedown(e) {
			e.preventDefault();
			if (!contains(this.$el, e.target) && this.$el != e.target) this.close();
			return false;
		},
	},
});
</script>

<style lang="stylus" scoped>
.notifications
	> button
		display block
		margin 0
		padding 0
		width 32px
		color var(--desktopHeaderFg)
		border none
		background transparent
		cursor pointer

		*
			pointer-events none

		&:hover
		&[data-active='true']
			color var(--desktopHeaderHoverFg)

		> i.bell
			font-size 1.2em
			line-height 48px

		> i.circle
			margin-left -5px
			vertical-align super
			font-size 10px
			color var(--notificationIndicator)
			animation blink 1s infinite

	> .pop
		$bgcolor = var(--face)
		display block
		position absolute
		top 56px
		right -72px
		width 300px
		background $bgcolor
		border-radius 16px
		padding 16px
		box-shadow 0 1px 4px rgba(#000, 0.25)
	
	> .blur
		backdrop-filter blur(10px)

		&:before
			content ""
			pointer-events none
			display block
			position absolute
			top -28px
			right 74px
			border-top solid 14px transparent
			border-right solid 14px transparent
			border-bottom solid 14px rgba(#000, 0.1)
			border-left solid 14px transparent

		&:after
			content ""
			pointer-events none
			display block
			position absolute
			top -27px
			right 74px
			border-top solid 14px transparent
			border-right solid 14px transparent
			border-bottom solid 14px $bgcolor
			border-left solid 14px transparent

		> .mk-notifications
			max-height 350px
			font-size 1rem
			overflow auto

</style>
