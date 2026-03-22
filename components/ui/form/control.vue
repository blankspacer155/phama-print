<script setup lang="ts">
import { useFormControlProvider } from './form-control.context'

const props = defineProps<{
  invalid?: boolean
  required?: boolean
  disabled?: boolean
}>()

const id = useId()
const invalid = computed(() => props.invalid ?? false)
const required = computed(() => props.required ?? false)
const disabled = computed(() => props.disabled ?? false)

useFormControlProvider({ id, invalid, required, disabled })
</script>
<template>
  <div role="group">
    <slot />
  </div>
</template>
