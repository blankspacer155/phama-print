<script setup lang="ts">
import { useFormControlInject } from './form/form-control.context'
import { cn } from '@/libs/utils'

const model = defineModel<string>()

const props = withDefaults(
  defineProps<{
    type?: 'text' | 'password'
    placeholder?: string
    disabled?: boolean
    invalid?: boolean
    inputClass?: string
    icon?: string
    maxlength?: number
    clearable?: boolean
    accept?: 'all' | 'number' | 'username' | 'english'
  }>(),
  {
    type: 'text',
    placeholder: '',
    disabled: false,
    invalid: false,
    inputClass: '',
    icon: undefined,
    maxlength: undefined,
    accept: 'all',
  },
)

const emit = defineEmits<{
  (e: 'iconClick'): void
  (e: 'enter', value: string): void
}>()

const formControl = useFormControlInject()
const id = computed(() => (formControl ? formControl.id : useId()))
const isInvalid = computed(() => (formControl ? formControl.invalid?.value : props.invalid))
const isDisabled = computed(() => (formControl ? formControl.disabled?.value : props.disabled))

function handleKeyPress($event: KeyboardEvent) {
  const key: string = $event.key

  if (key === 'Enter') {
    emit('enter', model.value ?? '')
  }

  if (props.accept === 'all') {
    return
  }

  if (props.accept === 'number') {
    const regex: RegExp = /^[0-9\b\t.]+$/

    if (!regex.test(key)) {
      $event.preventDefault()
    }
  }

  if (props.accept === 'username') {
    const regex: RegExp = /^[a-zA-Z0-9_]*$/
    if (!regex.test(key)) {
      $event.preventDefault()
    }
  }

  if (props.accept === 'english') {
    const regex: RegExp = /^[a-zA-Z]$/
    if (!regex.test(key)) {
      $event.preventDefault()
    }
  }
}

function handlePaste($event: ClipboardEvent) {
  const pastedText = $event.clipboardData?.getData('text/plain')

  if (!pastedText || props.accept === 'all') {
    return
  }

  if (props.accept === 'number') {
    const regex = /^\d*$/
    if (!regex.test(pastedText)) {
      $event.preventDefault()
    }
  }
}
</script>

<template>
  <div class="relative">
    <input
      :id="id"
      v-model="model"
      :type="type"
      :class="
        cn(
          'hl-16px-400 h-10 w-full rounded border border-input-field-border px-3 placeholder:font-hl placeholder:text-gray-60 focus:border-input-field-border-focused focus:ring-4 focus:ring-input-field-border-focused-effect focus-visible:outline-none disabled:bg-input-field-bg-disable disabled:text-gray-60',
          {
            'border-input-field-border-invalid focus:border-input-field-border-invalid': isInvalid,
            'pr-11': !!icon || clearable,
            'pr-16': !!model && clearable && !!icon,
          },
          inputClass,
        )
      "
      :placeholder="placeholder"
      :disabled="isDisabled"
      :maxlength="maxlength"
      @keypress="handleKeyPress"
      @paste="handlePaste"
    />

    <button
      v-if="model && !isDisabled && clearable"
      type="button"
      :class="
        cn('absolute inset-y-0 right-3 flex items-center', {
          'right-11': !!icon,
        })
      "
      @click="model = ''"
    >
      <Icon name="ph:x-circle-fill" class="text-gray-60" />
    </button>
    <button v-if="icon" type="button" class="absolute inset-y-0 right-3 flex items-center">
      <Icon :name="icon" class="text-2xl text-gray-60" @click="emit('iconClick')" />
    </button>
  </div>
</template>
