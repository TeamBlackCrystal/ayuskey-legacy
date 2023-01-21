<template>
	<div class="ui-input" :class="[{ focused, inline, disabled }, styl]">
		<div ref="icon" class="icon"><slot name="icon"></slot></div>
		<div class="input">
			<div
				v-if="withPasswordMeter"
				v-show="passwordStrength != ''"
				class="password-meter"
				:data-strength="passwordStrength"
			>
				<div ref="passwordMetarRef" class="value"></div>
			</div>
			<span ref="label" class="label"><slot></slot></span>
			<span ref="title" class="title">
				<slot name="title"></slot>
				<span v-if="invalid" class="warning"
					><fa :icon="['fa', 'exclamation-circle']" />{{
						inputRef.validationMessage
					}}</span
				>
			</span>
			<div ref="prefix" class="prefix"><slot name="prefix"></slot></div>
			<template v-if="type != 'file'">
				<!-- <input
					v-if="debounce"
					ref="input"
					v-model.lazy="v"
					v-debounce="500"
					:type="type"
					:disabled="disabled"
					:required="required"
					:readonly="readonly"
					:placeholder="placeholder"
					:pattern="pattern"
					:autocomplete="autocomplete"
					:spellcheck="spellcheck"
					:list="id"
					@focus="focused = true"
					@blur="focused = false"
					@keydown="$emit('keydown', $event)"
					@change="$emit('change', $event)"
				/> -->
				<input
					ref="inputRef"
					v-model="v"
					:type="type"
					:disabled="disabled"
					:required="required"
					:readonly="readonly"
					:placeholder="placeholder"
					:pattern="pattern"
					:autocomplete="autocomplete"
					:spellcheck="spellcheck"
					:list="id"
					@focus="focused = true"
					@blur="focused = false"
					@keydown="$emit('keydown', $event)"
				/>
				<datalist v-if="datalist" :id="id">
					<option v-for="data in datalist" :value="data" />
				</datalist>
			</template>
			<div ref="suffix" class="suffix"><slot name="suffix"></slot></div>
		</div>
		<div v-if="withPasswordToggle" class="toggle">
			<a @click="togglePassword">
				<span v-if="type == 'password'"
					><fa :icon="['fa', 'eye']" /> {{ i18n.t("@.show-password") }}</span
				>
				<span v-if="type != 'password'"
					><fa :icon="['far', 'eye-slash']" /> {{ i18n.t("@.hide-password") }}</span
				>
			</a>
		</div>
		<div class="desc"><slot name="desc"></slot></div>
	</div>
</template>

<script setup lang="ts">
// import debounce from "v-debounce";
import { nextTick, onMounted, ref, shallowRef, toRefs, watch } from "vue";
import { useInterval } from "../../../scripts/use-interval";
import { i18n as _i18n } from "../../../../i18n";
const i18n = _i18n()
const getPasswordStrength = require("syuilo-password-strength");
const props = withDefaults(defineProps<{
	modelValue: string | number,
	type?: string,
	required?: boolean,
	readonly?: boolean,
	disabled?: boolean,
	pattern?: string,
	placeholder?: string,
	autofocus?: boolean,
	autocomplete?: string,
	spellcheck?: boolean,
	debounce?: boolean,
	withPasswordMeter?: boolean
	withPasswordToggle?: boolean,
	styl?: string,
	datalist?: Array<any>,
	inline?:  boolean,
		
}>(), {
	autofocus: false,
	withPasswordMeter: false,
	withPasswordToggle: false,
})

const emit = defineEmits<{
	(ev: 'change', _ev: KeyboardEvent): void;
	(ev: 'keydown', _ev: KeyboardEvent): void;
	(ev: 'enter'): void;
	(ev: 'update:modelValue', value: string | number): void;
}>();


const { modelValue, type, withPasswordMeter, autofocus } = toRefs(props);
const v = ref<string | number>(props.modelValue)
const focused = ref<boolean>(false)
const invalid = ref<boolean>(false)
const passwordStrength = ref<string>('')
const id = ref<string>(Math.random().toString())

const inputRef = shallowRef<HTMLInputElement>()
const suffixEl = shallowRef<HTMLElement>()
const prefixEl = shallowRef<HTMLElement>()
const passwordMetarRef = shallowRef<HTMLElement>()


watch(modelValue, (newValue) => {
	console.log('watch,modelValue', newValue)
	v.value = newValue
})

watch(v, () => {
	if (type.value === 'number' && typeof v.value === 'string') {
		emit('update:modelValue', parseFloat(v.value))
	} else {
		emit('update:modelValue', v.value)
	}

	if (withPasswordMeter.value) {
		if (v.value === '') {
			passwordStrength.value = ''
			return
		}

		const strength = getPasswordStrength(v.value)
		passwordStrength.value = strength > 0.7 ? "high" : strength > 0.3 ? "medium" : "low";
		passwordMetarRef.value.style.width = `${strength * 100}%`;
	}
	invalid.value = inputRef.value.validity.badInput
})

const togglePassword = (): void => {
	type.value  = type.value === 'password' ? 'text' : 'password'
}

useInterval(() => {
	if (prefixEl.value) {
		if (prefixEl.value.offsetWidth) {
			inputRef.value.style.paddingLeft = prefixEl.value.offsetWidth + 'px';
		}
	}
	if (suffixEl.value) {
		if (suffixEl.value.offsetWidth) {
			inputRef.value.style.paddingRight = suffixEl.value.offsetWidth + 'px';
		}
	}
}, 100, {
	immediate: true,
	afterMounted: true,
});
onMounted(() => {
	nextTick(() => {
		if (autofocus.value) {
			focus();
		}
	});
});

</script>

<style lang="stylus" scoped>
root(fill)
	margin 32px 0

	> .icon
		position absolute
		top 0
		left 0
		width 24px
		text-align center
		line-height 32px
		color var(--inputLabel)

		&:not(:empty) + .input
			margin-left 28px

	> .input

		if !fill
			&:before
				content ''
				display block
				position absolute
				bottom 0
				left 0
				right 0
				height 1px
				background var(--inputBorder)

			&:after
				content ''
				display block
				position absolute
				bottom 0
				left 0
				right 0
				height 2px
				background var(--primary)
				opacity 0
				transform scaleX(0.12)
				transition border 0.3s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.3s cubic-bezier(0.4, 0, 0.2, 1), transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)
				will-change border opacity transform

		> .password-meter
			position absolute
			top 0
			left 0
			width 100%
			height 100%
			border-radius 6px
			overflow hidden
			opacity 0.3

			&[data-strength='']
				display none

			&[data-strength='low']
				> .value
					background #d73612

			&[data-strength='medium']
				> .value
					background #d7ca12

			&[data-strength='high']
				> .value
					background #61bb22

			> .value
				display block
				width 0
				height 100%
				background transparent
				border-radius 6px
				transition all 0.1s ease

		> .label
			position absolute
			z-index 1
			top fill ? 6px : 0
			left 0
			pointer-events none
			transition 0.4s cubic-bezier(0.25, 0.8, 0.25, 1)
			transition-duration 0.3s
			font-size 16px
			line-height 32px
			color var(--inputLabel)
			pointer-events none
			//will-change transform
			transform-origin top left
			transform scale(1)

		> .title
			position absolute
			z-index 1
			top fill ? -24px : -17px
			left 0 !important
			pointer-events none
			font-size 16px
			line-height 32px
			color var(--inputLabel)
			pointer-events none
			//will-change transform
			transform-origin top left
			transform scale(.75)
			white-space nowrap
			width 133%
			overflow hidden
			text-overflow ellipsis

			> .warning
				margin-left 0.5em
				color var(--infoWarnFg)

				> svg
					margin-right 0.1em

		> input
			display block
			width 100%
			margin 0
			padding 0
			font inherit
			font-weight fill ? bold : normal
			font-size 16px
			line-height 32px
			color var(--inputText)
			background transparent
			border none
			border-radius 0
			outline none
			box-shadow none

			if fill
				padding 6px 12px
				background rgba(#000, 0.035)
				border-radius 6px

			&[type='file']
				display none

		> .prefix
		> .suffix
			display block
			position absolute
			z-index 1
			top 0
			font-size 16px
			line-height fill ? 44px : 32px
			color var(--inputLabel)
			pointer-events none

			&:empty
				display none

			> *
				display inline-block
				min-width 16px
				max-width 150px
				overflow hidden
				white-space nowrap
				text-overflow ellipsis

		> .prefix
			left 0
			padding-right 4px

			if fill
				padding-left 12px

		> .suffix
			right 0
			padding-left 4px

			if fill
				padding-right 12px

	> .toggle
		cursor pointer
		padding-left 0.5em
		font-size 0.7em
		opacity 0.7
		text-align left

		> a
			color var(--inputLabel)
			text-decoration none

	> .desc
		margin 6px 0
		font-size 13px

		&:empty
			display none

		*
			margin 0

	&.focused
		> .input
			if fill
				background rgba(#000, 0.05)
			else
				&:after
					opacity 1
					transform scaleX(1)

			> .label
				color var(--primary)

	&.focused
	&.filled
		> .input
			> .label
				top fill ? -24px : -17px
				left 0 !important
				transform scale(0.75)

.ui-input
	&.fill
		root(true)
	&:not(.fill)
		root(false)

	&.inline
		display inline-block
		margin 0

	&.disabled
		opacity 0.7

		&, *
			cursor not-allowed !important
</style>
