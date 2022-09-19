<template>
<ui-card>
	<template #title>Account Info</template>

	<section>
		<div>
			<ui-horizon-group>
				<header>ID</header>
				<template><span class="_monospace">{{ $store.state.i.id }}</span></template>
			</ui-horizon-group>
			<ui-horizon-group>
				<header>{{ $t('registered-date') }}</header>
				<template><mk-time :time="$store.state.i.createdAt" mode="detail"/></template>
			</ui-horizon-group>
		</div>
	</section>

	<template v-if="stats">
		<section>
			<header>{{ $t('statistics') }}</header>
			<ui-horizon-group>
				<header>{{ $t('notes-count') }}</header>
				<template>{{ number(stats.notesCount) }}</template>
			</ui-horizon-group>
			<ui-horizon-group>
				<header>{{ $t('replies-count') }}</header>
				<template>{{ number(stats.repliesCount) }}</template>
			</ui-horizon-group>
			<ui-horizon-group>
				<header>{{ $t('renotes-count') }}</header>
				<template>{{ number(stats.renotesCount) }}</template>
			</ui-horizon-group>
			<ui-horizon-group>
				<header>{{ $t('replied-count') }}</header>
				<template>{{ number(stats.repliedCount) }}</template>
			</ui-horizon-group>
			<ui-horizon-group>
				<header>{{ $t('renoted-count') }}</header>
				<template>{{ number(stats.renotedCount) }}</template>
			</ui-horizon-group>
			<ui-horizon-group>
				<header>{{ $t('poll-votes-count') }}</header>
				<template>{{ number(stats.pollVotesCount) }}</template>
			</ui-horizon-group>
			<ui-horizon-group>
				<header>{{ $t('poll-voted-count') }}</header>
				<template>{{ number(stats.pollVotedCount) }}</template>
			</ui-horizon-group>
			<ui-horizon-group>
				<header>{{ $t('sent-reactions-count') }}</header>
				<template>{{ number(stats.sentReactionsCount) }}</template>
			</ui-horizon-group>
			<ui-horizon-group>
				<header>{{ $t('received-reactions-count') }}</header>
				<template>{{ number(stats.receivedReactionsCount) }}</template>
			</ui-horizon-group>
			<ui-horizon-group>
				<header>{{ $t('note-favorites-count') }}</header>
				<template>{{ number(stats.noteFavoritesCount) }}</template>
			</ui-horizon-group>
			<ui-horizon-group>
				<header>{{ $t('following-count') }}</header>
				<template>{{ number(stats.followingCount) }}</template>
			</ui-horizon-group>
			<ui-horizon-group>
				<header>{{ $t('following-count') }} ({{ $t('local') }})</header>
				<template>{{ number(stats.localFollowingCount) }}</template>
			</ui-horizon-group>
			<ui-horizon-group>
				<header>{{ $t('following-count') }} ({{ $t('remote') }})</header>
				<template>{{ number(stats.remoteFollowingCount) }}</template>
			</ui-horizon-group>
			<ui-horizon-group>
				<header>{{ $t('followers-count') }}</header>
				<template>{{ number(stats.followersCount) }}</template>
			</ui-horizon-group>
			<ui-horizon-group>
				<header>{{ $t('followers-count') }} ({{ $t('local') }})</header>
				<template>{{ number(stats.localFollowersCount) }}</template>
			</ui-horizon-group>
			<ui-horizon-group>
				<header>{{ $t('followers-count') }} ({{ $t('remote') }})</header>
				<template>{{ number(stats.remoteFollowersCount) }}</template>
			</ui-horizon-group>
			<ui-horizon-group>
				<header>{{ $t('page-likes-count') }}</header>
				<template>{{ number(stats.pageLikesCount) }}</template>
			</ui-horizon-group>
			<ui-horizon-group>
				<header>{{ $t('page-liked-count') }}</header>
				<template>{{ number(stats.pageLikedCount) }}</template>
			</ui-horizon-group>
			<ui-horizon-group>
				<header>{{ $t('drive-files-count') }}</header>
				<template>{{ number(stats.driveFilesCount) }}</template>
			</ui-horizon-group>
			<ui-horizon-group>
				<header>{{ $t('drive-usage') }}</header>
				<template>{{ bytes(stats.driveUsage) }}</template>
			</ui-horizon-group>
			<ui-horizon-group>
				<header>{{ $t('reversi-count') }}</header>
				<template>{{ number(stats.reversiCount) }}</template>
			</ui-horizon-group>
		</section>
	</template>

	<section>
		<header>{{ $t('other') }}</header>
		<ui-horizon-group>
			<header>emailVerified</header>
			<template>{{ $store.state.i.emailVerified ? $t('yes') : $t('no') }}</template>
		</ui-horizon-group>
		<ui-horizon-group>
			<header>twoFactorEnabled</header>
			<template>{{ $store.state.i.twoFactorEnabled ? $t('yes') : $t('no') }}</template>
		</ui-horizon-group>
		<ui-horizon-group>
			<header>securityKeys</header>
			<template>{{ $store.state.i.securityKeys ? $t('yes') : $t('no') }}</template>
		</ui-horizon-group>
		<ui-horizon-group>
			<header>usePasswordLessLogin</header>
			<template>{{ $store.state.i.usePasswordLessLogin ? $t('yes') : $t('no') }}</template>
		</ui-horizon-group>
		<ui-horizon-group>
			<header>isModerator</header>
			<template>{{ $store.state.i.isModerator ? $t('yes') : $t('no') }}</template>
		</ui-horizon-group>
		<ui-horizon-group>
			<header>isAdmin</header>
			<template>{{ $store.state.i.isAdmin ? $t('yes') : $t('no') }}</template>
		</ui-horizon-group>
	</section>
</ui-card>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { faInfoCircle } from '@fortawesome/free-solid-svg-icons';
import i18n from '../../../../i18n';
import number from '../../filters/v12/number';
import bytes from '../../filters/v12/bytes';

export default defineComponent({
	i18n: i18n('common/views/components/account-info.vue'),

	emits: ['info'],
	
	data() {
		return {
			INFO: {
				title: this.$t('accountInfo'),
				icon: faInfoCircle,
			},
			stats: null,
		};
	},

	mounted() {
		this.$emit('info', this.INFO);
		this.$root.api('users/stats', {
			userId: this.$store.state.i.id,
		}).then(stats => {
			this.stats = stats;
		});
	},
    
	methods: {
		number,
		bytes,
	},
});
</script>
