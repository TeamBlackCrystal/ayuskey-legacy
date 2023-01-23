<template>
<div class="ui-form">
	<fieldset :disabled="disabled">
		<slot></slot>
	</fieldset>
</div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
export default defineComponent({
	props: {
		disabled: {
			type: Boolean,
			required: false,
		},
	},
});
</script>

<style lang="stylus" scoped>

.ui-form
	> fieldset
		margin 0
		padding 0
		border none

</style>
