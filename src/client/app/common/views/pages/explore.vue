<template>
<div>
	<ui-input v-model="query" style="margin: 1.2em 0.5em 1.5em;">
		<span>{{ $t('searchUser') }}</span>
	</ui-input>
	<mk-user-list v-if="query && query !== ''" :key="`${query}`" :pagination="foundUsers">
		<fa :icon="faSearch" fixed-width/>{{ query }}
	</mk-user-list>

	<div v-if="meta && stats && tag == null" class="localfedi7" :style="{ backgroundImage: meta.bannerUrl ? `url(${meta.bannerUrl})` : null }">
		<header>{{ $t('explore', { host: meta.name || 'Misskey' }) }}</header>
		<div>{{ $t('users-info', { users: num(stats.originalUsersCount) }) }}</div>
	</div>

	<template v-if="tag == null">
		<mk-user-list :pagination="pinnedUsers" :expanded="false">
			<fa :icon="faBookmark" fixed-width/>{{ $t('pinned-users') }}
		</mk-user-list>
		<mk-user-list :pagination="verifiedUsers">
			<fa :icon="faCertificate" fixed-width/>{{ $t('verified-users') }}
		</mk-user-list>
		<mk-user-list :pagination="popularUsers" :expanded="false">
			<fa :icon="faChartLine" fixed-width/>{{ $t('popular-users') }}
		</mk-user-list>
		<mk-user-list :pagination="recentlyUpdatedUsers" :expanded="false">
			<fa :icon="faCommentAlt" fixed-width/>{{ $t('recently-updated-users') }}
		</mk-user-list>
		<mk-user-list :pagination="recentlyRegisteredUsers" :expanded="false">
			<fa :icon="faPlus" fixed-width/>{{ $t('recently-registered-users') }}
		</mk-user-list>
	</template>

	<div v-if="tag == null" class="localfedi7" :style="{ backgroundImage: `url(/assets/fedi.jpg)` }">
		<header>{{ $t('explore-fediverse') }}</header>
	</div>

	<ui-container ref="tags" :body-togglable="true" :expanded="false">
		<template #header><fa :icon="faHashtag" fixed-width/>{{ $t('popular-tags') }}</template>

		<div class="vxjfqztj">
			<router-link v-for="tag in tagsLocal" :key="'local:' + tag.tag" :to="`/explore/tags/${tag.tag}`" class="local">{{ tag.tag }}</router-link>
			<router-link v-for="tag in tagsRemote" :key="'remote:' + tag.tag" :to="`/explore/tags/${tag.tag}`">{{ tag.tag }}</router-link>
		</div>
	</ui-container>

	<mk-user-list v-if="tag != null" :key="`${tag}`" :pagination="tagUsers">
		<fa :icon="faHashtag" fixed-width/>{{ tag }}
	</mk-user-list>
	<template v-if="tag == null">
		<mk-user-list :pagination="popularUsersF" :expanded="false">
			<fa :icon="faChartLine" fixed-width/>{{ $t('popular-users') }}
		</mk-user-list>
		<mk-user-list :pagination="recentlyUpdatedUsersF" :expanded="false">
			<fa :icon="faCommentAlt" fixed-width/>{{ $t('recently-updated-users') }}
		</mk-user-list>
		<mk-user-list :pagination="recentlyRegisteredUsersF" :expanded="false">
			<fa :icon="faRocket" fixed-width/>{{ $t('recently-discovered-users') }}
		</mk-user-list>
	</template>
</div>
</template>

<script lang="ts">
import Vue, { defineComponent } from 'vue';
import i18n from '../../../i18n';
import { faChartLine, faPlus, faHashtag, faRocket, faCertificate, faSearch } from '@fortawesome/free-solid-svg-icons';
import { faBookmark, faCommentAlt } from '@fortawesome/free-regular-svg-icons';
import endpoint from '../../../../../server/api/endpoints/endpoint';

export default defineComponent({
	i18n: i18n('common/views/pages/explore.vue'),

	inject: {
		inNakedDeckColumn: {
			default: false,
		},
	},

	props: {
		tag: {
			type: String,
			required: false,
		},
	},

	data() {
		return {
			pinnedUsers: { endpoint: 'pinned-users' },
			verifiedUsers: { endpoint: 'users', limit: 10, params: {
				state: 'verified',
				origin: 'local',
				sort: '+follower',
			} },
			popularUsers: { endpoint: 'users', limit: 10, params: {
				state: 'alive',
				origin: 'local',
				sort: '+follower',
			} },
			recentlyUpdatedUsers: { endpoint: 'users', limit: 10, params: {
				origin: 'local',
				sort: '+updatedAt',
			} },
			recentlyRegisteredUsers: { endpoint: 'users', limit: 10, params: {
				origin: 'local',
				state: 'alive',
				sort: '+createdAt',
			} },
			popularUsersF: { endpoint: 'users', limit: 10, params: {
				state: 'alive',
				origin: 'remote',
				sort: '+follower',
			} },
			recentlyUpdatedUsersF: { endpoint: 'users', limit: 10, params: {
				origin: 'combined',
				sort: '+updatedAt',
			} },
			recentlyRegisteredUsersF: { endpoint: 'users', limit: 10, params: {
				origin: 'combined',
				sort: '+createdAt',
			} },
			tagsLocal: [],
			tagsRemote: [],
			stats: null,
			query: null,
			meta: null,
			num: Vue.filter('number'),
			faBookmark, faChartLine, faCommentAlt, faPlus, faHashtag, faRocket, faCertificate, faSearch,
		};
	},

	computed: {
		tagUsers(): any {
			return {
				endpoint: 'hashtags/users',
				limit: 30,
				params: {
					tag: this.tag,
					origin: 'combined',
					sort: '+follower',
				},
			};
		},
		foundUsers(): any {
			return {
				endpoint: 'users/search-by-username-and-host',
				limit: 30,
				params: {
					username: this.query,
				},
			};
		},
	},

	watch: {
		tag() {
			if (this.$refs.tags) this.$refs.tags.toggleContent(this.tag == null);
		},
	},

	created() {
		this.$emit('init', {
			title: this.$t('@.explore'),
			icon: faHashtag,
		});
		this.$root.api('hashtags/list', {
			sort: '+attachedLocalUsers',
			attachedToLocalUserOnly: true,
			limit: 30,
		}).then(tags => {
			this.tagsLocal = tags;
		});
		this.$root.api('hashtags/list', {
			sort: '+attachedRemoteUsers',
			attachedToRemoteUserOnly: true,
			limit: 30,
		}).then(tags => {
			this.tagsRemote = tags;
		});
		this.$root.api('stats').then(stats => {
			this.stats = stats;
		});
		this.$root.getMeta().then(meta => {
			this.meta = meta;
		});
	},

	mounted() {
		document.title = this.$root.instanceName;
	},
});
</script>

<style lang="stylus" scoped>
.localfedi7
	overflow hidden
	background var(--face)
	color #fff
	text-shadow 0 0 8px #000
	border-radius 6px
	padding 16px
	margin-top 16px
	margin-bottom 16px
	height 80px
	background-position 50%
	background-size cover
	> header
		font-size 20px
		font-weight bold
	> div
		font-size 14px
		opacity 0.8

.localfedi7:first-child
	margin-top 0

.vxjfqztj
	padding 16px

	> *
		margin-right 16px

		&.local
			font-weight bold
</style>
