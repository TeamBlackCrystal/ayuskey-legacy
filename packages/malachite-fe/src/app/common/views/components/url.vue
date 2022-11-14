<template>
<component :is="hasRoute ? 'router-link' : 'a'" class="mk-url" :[attr]="hasRoute ? url.substr(local.length) : url" :rel="rel" :target="target">
	<template v-if="!self">
		<span class="schema">{{ schema }}//</span>
		<span class="hostname">{{ hostname }}</span>
		<span v-if="port != ''" class="port">:{{ port }}</span>
	</template>
	<template v-if="pathname === '/' && self">
		<span class="self">{{ hostname }}</span>
	</template>
	<span v-if="pathname != ''" class="pathname">{{ self ? pathname.substr(1) : pathname }}</span>
	<span class="query">{{ query }}</span>
	<span class="hash">{{ hash }}</span>
	<fa v-if="target === '_blank'" icon="external-link-square-alt"/>
</component>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { toUnicode as decodePunycode } from 'punycode';
import { url as local } from '../../../config';

export default defineComponent({
	props: ['url', 'rel'],
	data() {
		const isSelf = this.url.startsWith(local);
		const hasRoute = isSelf && (
			(this.url.substr(local.length) === '/') ||
			this.url.substr(local.length).startsWith('/@') ||
			this.url.substr(local.length).startsWith('/notes/') ||
			this.url.substr(local.length).startsWith('/tags/') ||
			this.url.substr(local.length).startsWith('/pages/'));
		return {
			local,
			schema: null,
			hostname: null,
			port: null,
			pathname: null,
			query: null,
			hash: null,
			self: isSelf,
			hasRoute: hasRoute,
			attr: hasRoute ? 'to' : 'href',
			target: hasRoute ? null : '_blank',
		};
	},
	created() {
		const url = new URL(this.url);
		this.schema = url.protocol;
		this.hostname = decodePunycode(url.hostname);
		this.port = url.port;
		this.pathname = decodeURIComponent(url.pathname);
		this.query = decodeURIComponent(url.search);
		this.hash = decodeURIComponent(url.hash);
	},
});
</script>

<style lang="stylus" scoped>
.mk-url
	word-break break-all

	> [data-icon]
		padding-left 2px
		font-size .9em
		font-weight 400
		font-style normal

	> .self
		font-weight bold

	> .schema
		opacity 0.5

	> .hostname
		font-weight bold

	> .pathname
		opacity 0.8

	> .query
		opacity 0.5

	> .hash
		font-style italic
</style>
