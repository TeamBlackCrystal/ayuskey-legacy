<template>
<div class="body-container">
	<ui-card>
		<template #title>Experiments</template>
		<section>
			<ui-info warn>警告: 試験運用の機能です。これらの機能を有効にすると、Misskeyが正しく動作しなくなる可能性があります。また、ここにあるすべての機能が動作するわけではありません。</ui-info>
		</section>
	</ui-card>
</div>
</template>

<script>
import Vue from 'vue';
import i18n from '../../../i18n';

export default Vue.extend({
	i18n: i18n()
});
</script>

<style scoped>
.body-container {
	--side-padding: 20px;
	display: flex;
	flex: 1;
	flex-direction: column;
	margin: 0 auto;
	max-width: calc(700px + 2 * var(--side-padding));
	width: 100%;
}
</style>
