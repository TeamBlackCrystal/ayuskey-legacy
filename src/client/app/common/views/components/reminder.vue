<template>
	<form class="mk-reminder" :class="{ reminderg }" @submit.prevent="onSubmit">
		<ui-input
			v-model="username"
			type="text"
			pattern="^[a-zA-Z0-9_]+$"
			spellcheck="false"
			required
		>
			<span>{{ i18n.t("username") }}</span>
			<template #prefix>@</template>
		</ui-input>
		<ui-input v-model="email" type="text" spellcheck="false" required>
			<span>{{ i18n.t("email") }}</span>
		</ui-input>
		<p class="desc">
			{{ i18n.t("desc") }}
		</p>
		<ui-button type="submit" :disabled="reminderg">{{
			i18n.t("submit")
		}}</ui-button>
	</form>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { api } from "../../../api";
import { i18n as _i18n } from "../../../i18n";

const i18n = _i18n("common/views/components/reminder.vue");

const reminderg = ref(false);
const username = ref("");
const email = ref("");

const emit = defineEmits(["done"]);

function onSubmit() {
	reminderg.value = true;
	api
		.request("request-reset-password", {
			params: {
				username: username.value,
				email: email.value,
			},
		})
		.then((res) => {
			this.$root.dialog({
				type: "success",
				splash: true,
			}); // TODO: AY-413
			emit("done");
		})
		.catch(() => {
			alert(i18n.t("failed"));
			reminderg.value = false;
		});
}
</script>

<style lang="stylus" scoped>
.mk-reminder
	color #555
	&.reminderg
		&, *
			cursor wait !important
	> .desc
		font-size small
</style>
