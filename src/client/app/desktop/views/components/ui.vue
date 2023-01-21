<template>
<div v-hotkey.global="keymap" class="mk-ui">
	<div v-if="$store.getters.isSignedIn && $store.state.settings.wallpaper" class="bg" :style="style"></div>
	<x-header v-if="navbar == 'top'" v-show="!zenMode" ref="header" class="header"/>
	<x-sidebar v-if="navbar != 'top'" v-show="!zenMode" ref="sidebar" class="sidebar"/>
	<div class="content" :class="[{ sidebar: navbar != 'top', zen: zenMode }, navbar]">
		<slot></slot>
	</div>
	<mk-stream-indicator v-if="$store.getters.isSignedIn"/>
	<!--TODO: コンポーネントに切り分ける-->
	<div class="ver">
		<p>Ayuskey on Vue3</p>
		<p>
			<fa :icon="faCodeCommit" class="fa-fw"/>
			<span>app: {{ version.replace('11.37.1-rei0784-', '') }}</span>
		</p>
		<p>
			<fa :icon="faVuejs" class="fa-fw"/>
			<span>vue: {{ vueVersion }}</span>
		</p>
	</div>
</div>
</template>

<script lang="ts">
import { defineComponent, version as vueVersion } from 'vue';
import { faCodeCommit } from '@fortawesome/free-solid-svg-icons';
import { faVuejs } from '@fortawesome/free-brands-svg-icons';
import { version } from '../../../config';
import XHeader from './ui.header.vue';
import XSidebar from './ui.sidebar.vue';

export default defineComponent({
	components: {
		XHeader,
		XSidebar,
	},

	data() {
		return {
			zenMode: false,
			version,
			vueVersion,
			faCodeCommit, faVuejs,
		};
	},

	computed: {
		navbar(): string {
			return this.$store.state.device.navbar;
		},

		style(): any {
			if (!this.$store.getters.isSignedIn || this.$store.state.settings.wallpaper == null) return {};
			return {
				backgroundImage: `url(${ this.$store.state.settings.wallpaper })`,
			};
		},

		keymap(): any {
			return {
				'p': this.post,
				'n': this.post,
				'z': this.toggleZenMode,
			};
		},
	},

	watch: {
		'$store.state.uiHeaderHeight'() {
			this.$el.style.paddingTop = this.$store.state.uiHeaderHeight + 'px';
		},

		navbar() {
			if (this.navbar != 'top') {
				this.$store.commit('setUiHeaderHeight', 0);
			}
		},
	},

	mounted() {
		this.$el.style.paddingTop = this.$store.state.uiHeaderHeight + 'px';
	},

	methods: {
		post() {
			this.$post();
		},

		toggleZenMode() {
			this.zenMode = !this.zenMode;
			this.$nextTick(() => {
				if (this.$refs.header) {
					this.$store.commit('setUiHeaderHeight', this.$refs.header.$el.offsetHeight);
				}
			});
		},
	},
});
</script>

<style lang="stylus" scoped>
.mk-ui
	min-height 100vh
	padding-top 48px

	> .bg
		position fixed
		top 0
		left 0
		width 100%
		height 100vh
		background-size cover
		background-position center
		background-attachment fixed

	> .content.sidebar.left
		padding-left 68px

	> .content.sidebar.right
		padding-right 68px

	> .content.zen
		padding 0 !important
	
	> .ver
		pointer-events none
		position fixed
		z-index 16284
		bottom 8px
		right 8px
		margin 0
		padding 6px 12px
		font-size 0.9em
		color #fff
		background rgba(#000, 0.8)
		border-radius 4px

		> p
			display block
			margin 0

			> [data-icon]
				margin-right 0.25em

</style>
