<template>
<div>
	<ui-container :body-togglable="true">
		<template #header><fa :icon="faEdit" fixed-width/>{{ $t('my-pages') }}</template>
		<div class="rknalgpo my">
			<ui-button class="new" @click="create()"><fa :icon="faPlus"/></ui-button>
			<ui-pagination v-slot="{items}" :pagination="myPagesPagination">
				<x-page-preview v-for="page in items" :key="page.id" class="ckltabjg" :page="page"/>
			</ui-pagination>
		</div>
	</ui-container>

	<ui-container :body-togglable="true">
		<template #header><fa :icon="faHeart" fixed-width/>{{ $t('liked-pages') }}</template>
		<div class="rknalgpo">
			<ui-pagination v-slot="{items}" :pagination="likedPagesPagination">
				<x-page-preview v-for="like in items" :key="like.page.id" class="ckltabjg" :page="like.page"/>
			</ui-pagination>
		</div>
	</ui-container>
</div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { faPlus, faEdit } from '@fortawesome/free-solid-svg-icons';
import { faStickyNote, faHeart } from '@fortawesome/free-regular-svg-icons';
import i18n from '../../../i18n';
import XPagePreview from '../../views/components/page-preview.vue';

export default defineComponent({
	i18n: i18n('pages'),
	components: {
		XPagePreview,
	},
	data() {
		return {
			myPagesPagination: {
				endpoint: 'i/pages',
				limit: 5,
			},
			likedPagesPagination: {
				endpoint: 'i/page-likes',
				limit: 5,
			},
			faStickyNote, faPlus, faEdit, faHeart,
		};
	},
	created() {
		this.$emit('init', {
			title: this.$t('@.pages'),
			icon: faStickyNote,
		});
	},
	mounted() {
		document.title = this.$root.instanceName;
	},
	methods: {
		create() {
			this.$router.push('/i/pages/new');
		},
	},
});
</script>

<style lang="stylus" scoped>
.rknalgpo
	padding 16px

	&.my .ckltabjg:first-child
		margin-top 16px

	.ckltabjg:not(:last-child)
		margin-bottom 8px

	@media (min-width 500px)
		.ckltabjg:not(:last-child)
			margin-bottom 16px

</style>
