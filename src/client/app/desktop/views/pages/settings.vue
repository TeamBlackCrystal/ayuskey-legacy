<template>
<mk-ui>
	<main>
		<x-settings :in-window="false" :page="$route.params.page" />
	</main>
</mk-ui>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
	components: {
		XSettings: () => import('../components/settings.vue').then(m => m.default),
	},
	mounted() {
		document.title = this.$root.instanceName;
	},
});
</script>

<style lang="stylus" scoped>
main
	margin 0 auto
	max-width 900px

</style>
