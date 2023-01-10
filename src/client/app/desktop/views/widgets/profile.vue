<template>
<div class="egwyvoaaryotefqhqtmiyawwefemjfsd">
	<ui-container :show-header="false" :naked="props.design == 2">
		<div
			class="egwyvoaaryotefqhqtmiyawwefemjfsd-body"
			:data-compact="props.design == 1 || props.design == 2"
			:data-melt="props.design == 2"
		>
			<div
				class="banner"
				:style="store.i.bannerUrl ? `background-image: url(${store.i.bannerUrl})` : ''"
				:title="i18n.t('update-banner')"
				@click="updateBanner()"
			></div>
			<mk-avatar
				class="avatar" :user="store.i"
				:disable-link="true"
				:title="i18n.t('update-avatar')"
				@click="updateAvatar()"
			/>
			<router-link class="name" :to="userPage(store.i)"><mk-user-name :user="store.i"/></router-link>
			<p class="username">@{{ acct(store.i) }}</p>
		</div>
	</ui-container>
</div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import define from '../../../common/define-widget-define-component';
import { i18n as _i18n } from '../../../i18n';
import updateAvatar from '../../api/update-avatar';
import updateBanner from '../../api/update-banner';
import { acct, userPage } from '../../../common/views/filters/v12/user';
import { useStore } from '../../../store';

const widgets = define({
	name: 'profile',
	props: () => ({
		design: 0,
	}),
});

export default defineComponent({
	extends: widgets,
	data () {
		return {
			i18n: _i18n('desktop/views/widgets/profile.vue'),
			store: useStore(),
		};
	},
	methods: {
		func() {
			if (this.props.design == 2) {
				this.props.design = 0;
			} else {
				this.props.design++;
			}
			this.save();
		},
		updateAvatar() {
			updateAvatar(this.$root)();
		},
		updateBanner() {
			updateBanner(this.$root)();
		},
		acct, userPage,
	},
});
</script>

<style lang="stylus">

.mk-avatar /*アバターが初期状態の際 テーマと合わせれる為に必要*/
	color: var(--link)
</style>

<style lang="stylus" scoped>
.egwyvoaaryotefqhqtmiyawwefemjfsd-body
	&[data-compact]
		> .banner:before
			content ""
			display block
			width 100%
			height 100%
			background rgba(#000, 0.5)

		> .avatar
			top ((100px - 58px) / 2)
			left ((100px - 58px) / 2)
			border none
			border-radius 100%
			box-shadow 0 0 16px rgba(#000, 0.5)
		> .name
			position absolute
			top 0
			left 92px
			margin 0
			line-height 100px
			color #fff
			text-shadow 0 0 8px rgba(#000, 0.5)

		> .username
			display none

	&[data-melt]
		> .banner
			visibility hidden

		> .avatar
			box-shadow none

		> .name
			color #666
			text-shadow none

	> .banner
		height 100px
		background-color var(--primaryAlpha01)
		background-size cover
		background-position center
		cursor pointer

	> .avatar
		display block
		position absolute
		top 76px
		left 16px
		width 58px
		height 58px
		border solid 3px var(--face)
		border-radius 8px
		cursor pointer

	> .name
		display block
		margin 10px 0 0 84px
		line-height 16px
		font-weight bold
		color var(--text)
		overflow hidden
		text-overflow ellipsis

	> .username
		display block
		margin 4px 0 8px 84px
		line-height 16px
		font-size 0.9em
		color var(--text)
		opacity 0.7

</style>
