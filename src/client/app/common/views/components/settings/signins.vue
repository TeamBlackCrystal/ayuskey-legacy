<template>
<div class="root">
	<div v-if="signins.length != 0" class="signins">
		<div v-for="signin in signins">
			<header @click="signin._show = !signin._show">
				<template v-if="signin.success"><fa icon="check"/></template>
				<template v-else><fa icon="times"/></template>
				<span class="ip _monospace">{{ signin.ip }}</span>
				<mk-time :time="signin.createdAt"/>
			</header>
			<div v-show="signin._show" class="headers">
			<!-- TODO -->
			</div>
		</div>
	</div>
</div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
export default defineComponent({
	data() {
		return {
			fetching: true,
			signins: [],
			connection: null,
		};
	},

	mounted() {
		this.$root.api('i/signin_history').then(signins => {
			this.signins = signins;
			this.fetching = false;
		});

		this.connection = this.$root.stream.useSharedConnection('main');

		this.connection.on('signin', this.onSignin);
	},

	beforeUnmount() {
		this.connection.dispose();
	},

	methods: {
		onSignin(signin) {
			this.signins.unshift(signin);
		},
	},
});
</script>

<style lang="stylus" scoped>
.root
	> .signins
		> div
			border-bottom solid 1px #eee

			> header
				display flex
				padding 8px 0
				line-height 32px
				cursor pointer

				> [data-icon]
					margin-right 8px
					text-align left

					&.check
						color #0fda82

					&.times
						color #ff3100

				> .ip
					display inline-block
					text-align left
					padding 8px
					line-height 16px
					border-radius 4px

				> .mk-time
					margin-left auto
					text-align right
					color #777

			> .headers
				overflow auto
				margin 0 0 16px 0
				max-height 100px
				white-space pre-wrap
				word-break break-all

</style>
