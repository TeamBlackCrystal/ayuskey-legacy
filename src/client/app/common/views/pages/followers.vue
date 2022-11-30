<template>
<mk-user-list :pagination="pagination" :extract="items => items.map(item => item.follower)">{{ $t('@.followers') }}</mk-user-list>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import parseAcct from '../../../../../misc/acct/parse';
import i18n from '../../../i18n';

export default defineComponent({
	i18n: i18n(),

	data() {
		return {
			pagination: {
				endpoint: 'users/followers',
				limit: 30,
				params: {
					...parseAcct(this.$route.params.user),
				},
			},
		};
	},
});
</script>
