<script setup lang="ts">
import numeral from 'numeral'
import { useFormControlInject } from './form/form-control.context'
import { cn } from '@/libs/utils'

const model = defineModel<number | null>()

const props = withDefaults(
  defineProps<{
    placeholder?: string
    disabled?: boolean
    invalid?: boolean
    inputClass?: string
    icon?: string
    precision?: number
    paddingRight?: boolean
  }>(),
  {
    placeholder: '',
    disabled: false,
    invalid: false,
    inputClass: '',
    icon: undefined,
    precision: 2,
  },
)

const emit = defineEmits<{
  (e: 'iconClick'): void
  (e: 'enter', value: number): void
}>()

const formControl = useFormControlInject()
const id = computed(() => (formControl ? formControl.id : useId()))
const isInvalid = computed(() => (formControl ? formControl.invalid?.value : props.invalid))
const isDisabled = computed(() => (formControl ? formControl.disabled?.value : props.disabled))

const format = computed(() => {
  return `0,0[.][${Array(props.precision).fill('0').join('')}]`
})

const formatedValue = computed({
  get() {
    if (model.value === null || model.value === undefined) {
      return ''
    } else {
      return numeral(model.value).format(format.value)
    }
  },
  set(newValue) {
    model.value = newValue ? numeral(newValue).value() : 0
  },
})

function handleKeyPress($event: KeyboardEvent) {
  const key: string = $event.key
  const currentValue: string = ($event.target as HTMLInputElement).value

  if (key === 'Enter') {
    emit('enter', model.value ?? 0)
  }

  const regex: RegExp = /^[0-9\b\t.]+$/

  if (!regex.test(key)) {
    $event.preventDefault()
  }

  if (key === '.' && (currentValue.includes('.') || props.precision === 0)) {
    $event.preventDefault()
  }

  const decimalIndex: number = currentValue.indexOf('.')
  if (
    decimalIndex !== -1 &&
    currentValue.substring(decimalIndex + 1).length >= props.precision &&
    key !== '\b'
  ) {
    $event.preventDefault()
  }
}

function handlePaste($event: ClipboardEvent) {
  const pastedText = $event.clipboardData?.getData('text/plain')

  if (!pastedText) {
    return
  }

  const regex = /^\d*$/
  if (!regex.test(pastedText)) {
    $event.preventDefault()
  }
}
</script>

<template>
  <div class="relative">
    <input
      :id="id"
      v-model="formatedValue"
      type="text"
      :class="
        cn(
          'hl-16px-400 h-10 w-full rounded border border-input-field-border px-3 placeholder:font-hl placeholder:text-gray-60 focus:border-input-field-border-focused focus:ring-4 focus:ring-input-field-border-focused-effect focus-visible:outline-none disabled:bg-input-field-bg-disable disabled:text-gray-60',
          {
            'border-input-field-border-invalid focus:border-input-field-border-invalid': isInvalid,
            'pr-11': !!icon,
            'pr-16': !!paddingRight,
          },
          inputClass,
        )
      "
      :placeholder="placeholder"
      :disabled="isDisabled"
      :maxlength="20"
      @keypress="handleKeyPress"
      @paste="handlePaste"
    />
    <slot name="icon">
      <button v-if="icon" type="button" class="absolute inset-y-0 right-3 flex items-center">
        <Icon :name="icon" class="text-2xl text-gray-60" @click="emit('iconClick')" />
      </button>
    </slot>
  </div>
</template>
