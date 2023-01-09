<template>
<x-container :draggable="true" @remove="() => $emit('remove')">
	<template #header><fa :icon="faPaperPlane"/> {{ $t('blocks.post') }}</template>

	<section style="padding: 0 16px 16px 16px;">
		<ui-textarea v-model="value.text">{{ $t('blocks._post.text') }}</ui-textarea>
	</section>
</x-container>
</template>

<script lang="ts">
import Vue, { defineComponent } from 'vue';
import { faPaperPlane } from '@fortawesome/free-regular-svg-icons';
import i18n from '../../../../../i18n';
import XContainer from '../page-editor.container.vue';

export default defineComponent({
	i18n: i18n('pages'),

	components: {
		XContainer,
	},

	props: {
		value: {
			required: true,
		},
	},

	data() {
		return {
			faPaperPlane,
		};
	},

	created() {
		if (this.value.text == null) Vue.set(this.value, 'text', '');
	},
});
</script>
