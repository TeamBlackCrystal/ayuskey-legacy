<template>
<div class="mkw-customize">
	<ui-button @click="customize()">{{ $t('@.customize-home') }}</ui-button>
</div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import define from '../../../common/define-widget-define-component';
import i18n from '../../../i18n';

const widgets = define({
	name: 'customize',
});

export default defineComponent({
	extends: widgets,
	i18n: i18n(),
	methods: {
		customize(date) {
			location.href = '/?customize';
		},
	},
});
</script>
