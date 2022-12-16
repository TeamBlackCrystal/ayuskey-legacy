<template>
<mk-ui>
	<b-button to="/apps" variant="primary">{{ $t('manage-apps') }}</b-button>
</mk-ui>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import i18n from '../../i18n';
export default defineComponent({
	i18n: i18n('dev/views/index.vue'),
});
</script>
