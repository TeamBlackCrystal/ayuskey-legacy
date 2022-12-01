<template>
	<router-view id="app" v-hotkey.global="keymap"></router-view>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { url, lang } from "./config";
import { useStore } from "./store";

const store = useStore();

const keymap = computed(() => {
	return {
		"h|slash": help,
		d: dark,
	};
});

function help() {
	window.open(`${url}/docs/${lang}/keyboard-shortcut`, "_blank");
}

function dark() {
	store.device.darkmode = !store.device.darkmode;
}
</script>
