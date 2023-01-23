<template>
<div>
	<mk-avatar v-for="user in us" :key="user.id" :user="user" style="width:32px;height:32px;"/>
</div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
	props: {
		userIds: {
			required: true,
		},
	},
	data() {
		return {
			us: [],
		};
	},
	async created() {
		this.us = await this.$root.api('users/show', {
			userIds: this.userIds,
		});
	},
});
</script>
