<template>
<mfm-core v-once v-bind="$attrs" class="havbbuyv" :class="{ nowrap: $attrs['nowrap'] }"/>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import MfmCore from './mfm';

export default defineComponent({
	components: {
		MfmCore,
	},
});
</script>

<style lang="stylus" scoped>
.havbbuyv
	white-space pre-wrap

	&.nowrap
		white-space pre
		word-wrap normal // https://codeday.me/jp/qa/20190424/690106.html

	:deep(.title)
		display block
		margin-bottom 4px
		padding 4px
		font-size 90%
		text-align center
		background var(--mfmTitleBg)
		border-radius 4px

	:deep(.quote)
		display block
		margin 8px
		padding 6px 0 6px 12px
		color var(--mfmQuote)
		border-left solid 3px var(--mfmQuoteLine)

	:deep(pre)
		font-size 80%

	:deep(code)
		font-size 80%

</style>
