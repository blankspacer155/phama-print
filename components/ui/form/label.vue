<script setup lang="ts">
import { useFormControlInject } from './form-control.context'
import { cn } from '@/libs/utils'

const formControl = useFormControlInject()

const id = formControl ? `${formControl.id}:-label` : undefined

const isRequired = computed(() => (formControl ? formControl.required?.value : false))
</script>
<template>
  <label
    :id="id"
    :class="cn('hl-14px-400 mb-1 block text-start align-middle', $attrs.class ?? '')"
    :for="formControl?.id"
  >
    <slot />
    <span v-if="isRequired" class="ml-1  text-red-400" role="presentation">*</span>
  </label>
</template>
