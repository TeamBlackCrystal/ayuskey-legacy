<template>
<router-link v-if="instance != null" class="instance-info-wrap" :to="`/search?q=${ encodeURIComponent(`host:${instance.host}`) }`">
	<div class="instance-info" :title="getDetail(instance)" :style="{ background: `linear-gradient(to right, ${themeColor}, rgba(0, 0, 0, 0))` }">
		<img v-if="instance.faviconUrl != null" class="icon" :src="`/proxy/icon.ico?${urlQuery({ url: instance.faviconUrl })}`"/>
		<div class="name">
			{{ (instance.name && instance.name !== instance.host) ? `${instance.name} (${instance.host})` : `${instance.host}` }}
		</div>
	</div>
</router-link>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { query as urlQuery } from '../../../../../prelude/url';

type II = {
	host?: string;
	name?: string;
	softwareName?: string;
	softwareVersion?: string;
	// 本家と同じ仕様?
	faviconUrl: '/favicon.ico';
};

export default defineComponent({ 
	props: ['instance'],
	data() {
		return {
			urlQuery,
		};
	},
	computed: {
		themeColor(): string {
			if (this.instance.themeColor) {
				const m = this.instance.themeColor.match(/^#([0-9A-Fa-f]{2})([0-9A-Fa-f]{2})([0-9A-Fa-f]{2})/);	// TODO: other format
				const r = parseInt(m[1], 16);
				const g = parseInt(m[2], 16);
				const b = parseInt(m[3], 16);
				return `rgba(${r}, ${g}, ${b}, 0.5)`;
			} else {
				return 'rgba(64, 64, 255, 0.5)';
			}
		},
	},
	mounted() {
		if (this.instance.softwareName === 'misskey' && this.instance.softwareVersion && this.instance.softwareVersion.includes('-gp-')) {
			this.instance.softwareName = 'groundpolis';
		} else if (this.instance.softwareName === 'misskey' && this.instance.softwareVersion && this.instance.softwareVersion.includes('-rei0784-')) {
			this.instance.softwareName = 'ayuskey';
		} else if (this.instance.softwareName === 'misskey' && this.instance.softwareVersion && this.instance.softwareVersion.includes('-m544')) {
			this.instance.softwareName = 'meisskey';
		}
	},
	methods: {
		getName(instance: II): string {
			if (!instance) return 'Unknown';
			return instance.name ? `${instance.name} (${instance.host})` : `${instance.host}`;
		},
		getDetail(instance: II): string {
			let s = this.getName(instance);
			if (instance.softwareName) {
				s += '\n' + (instance.softwareVersion ? `${instance.softwareName} (${instance.softwareVersion})` : `${instance.softwareName})`);
			}
			return s;
		},
	},
});
</script>

<style lang="stylus" scoped>
	.instance-info-wrap
		text-decoration none 
		cursor pointer
		.instance-info
			display flex
			align-items center
			font-size 0.9em
			color var(--noteText)
			border-radius 0.2em
			margin-bottom 0.3em
			.icon
				width 1em
				height 1em
				margin-right 0.2em
			.name
				overflow hidden
				white-space nowrap
				text-overflow ellipsis
</style>
