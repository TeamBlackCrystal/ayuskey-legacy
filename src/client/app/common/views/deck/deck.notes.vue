<template>
<div class="eamppglmnmimdhrlzhplwpvyeaqmmhxu">
	<div v-if="empty" class="empty">{{ $t('@.no-notes') }}</div>

	<mk-error v-if="error" @retry="init()"/>

	<div v-if="fetching" class="placeholder">
		<template v-for="i in 10" :key="i">
			<mk-note-skeleton/>
		</template>
	</div>

	<!-- トランジションを有効にするとなぜかメモリリークする -->
	<component :is="!$store.state.device.reduceMotion ? 'transition-group' : 'div'" ref="notes" name="mk-notes" class="transition notes" tag="div">
		<template v-for="(note, i) in _notes" :key="note.id">
			<mk-note
				:note="note"
				:compact="true"
			/>
			<p v-if="i != notes.length - 1 && note._date != _notes[i + 1]._date" class="date">
				<span><fa icon="angle-up"/>{{ note._datetext }}</span>
				<span><fa icon="angle-down"/>{{ _notes[i + 1]._datetext }}</span>
			</p>
		</template>
	</component>

	<footer v-if="more">
		<button :disabled="moreFetching" :style="{ cursor: moreFetching ? 'wait' : 'pointer' }" @click="fetchMore()">
			<template v-if="!moreFetching">{{ $t('@.load-more') }}</template>
			<template v-if="moreFetching"><fa icon="spinner" pulse fixed-width/></template>
		</button>
	</footer>
</div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import i18n from '../../../i18n';
import shouldMuteNote from '../../../common/scripts/should-mute-note';
import paging from '../../../common/scripts/paging';

export default defineComponent({
	i18n: i18n(),

	inject: ['column', 'isScrollTop', 'count'],

	mixins: [
		paging({
			limit: 20,

			onQueueChanged: (self, q) => {
				self.count(q.length);
			},

			onPrepend: (self, note, silent) => {
				// 弾く
				if (shouldMuteNote(self.$store.state.i, self.$store.state.settings, note)) return false;

				// タブが非表示またはスクロール位置が最上部ではないならタイトルで通知
				if (document.hidden || !self.isScrollTop()) {
					self.$store.commit('pushBehindNote', note);
				}
			},
		}),
	],

	props: {
		pagination: {
			required: true,
		},
		extract: {
			required: false,
		},
	},

	computed: {
		notes() {
			return this.extract ? this.extract(this.items) : this.items;
		},

		_notes(): any[] {
			return (this.notes as any).map(note => {
				const date = new Date(note.createdAt).getDate();
				const month = new Date(note.createdAt).getMonth() + 1;
				note._date = date;
				note._datetext = this.$t('@.month-and-day').replace('{month}', month.toString()).replace('{day}', date.toString());
				return note;
			});
		},
	},

	created() {
		this.column.$on('top', this.onTop);
		this.column.$on('bottom', this.onBottom);
		this.init();
	},

	beforeUnmount() {
		this.column.$off('top', this.onTop);
		this.column.$off('bottom', this.onBottom);
	},

	methods: {
		focus() {
			(this.$refs.notes as any).children[0].focus ? (this.$refs.notes as any).children[0].focus() : (this.$refs.notes as any).$el.children[0].focus();
		},
	},
});
</script>

<style lang="stylus" scoped>
.eamppglmnmimdhrlzhplwpvyeaqmmhxu
	.transition
		.mk-notes-enter
		.mk-notes-leave-to
			opacity 0
			transform translateY(-30px)

		> *
			transition transform .3s ease, opacity .3s ease

	> .empty
		padding 16px
		text-align center
		color var(--text)

	> .placeholder
		padding 16px
		opacity 0.3

	> .notes
		> .date
			display block
			margin 0
			line-height 28px
			font-size 12px
			text-align center
			color var(--dateDividerFg)
			background var(--dateDividerBg)
			border-bottom solid var(--lineWidth) var(--faceDivider)

			span
				margin 0 16px

			[data-icon]
				margin-right 8px

	> footer
		> button
			display block
			margin 0
			padding 16px
			width 100%
			text-align center
			color #ccc
			background var(--face)
			border-top solid var(--lineWidth) var(--faceDivider)
			border-bottom-left-radius 6px
			border-bottom-right-radius 6px

			&:hover
				box-shadow 0 0 0 100px inset rgba(0, 0, 0, 0.05)

			&:active
				box-shadow 0 0 0 100px inset rgba(0, 0, 0, 0.1)

</style>
