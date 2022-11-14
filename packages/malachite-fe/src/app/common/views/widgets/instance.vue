<template>
<div class="mkw-instance">
	<ui-container>
		<mk-instance/>
	</ui-container>
</div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import define from '../../../common/define-widget-define-component';

const widget = define({
	name: 'instance',
});

export default defineComponent({
	extends: widget,
});
</script>
