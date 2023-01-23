<template>
<span class="mk-file-type-icon">
	<template v-if="kind == 'image'"><fa icon="file-image"/></template>
</span>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
	props: ['type'],
	computed: {
		kind(): string {
			return this.type.split('/')[0];
		},
	},
});
</script>
