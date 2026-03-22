<script setup lang="ts">
import {VueDatePicker} from '@vuepic/vue-datepicker'
import { useFormControlInject } from '../form/form-control.context'
import { format, toThaiTimezoneISOString } from './picker.utils'
import { cn } from '@/libs/utils'
import {th} from "date-fns/locale"

import '@vuepic/vue-datepicker/dist/main.css'
import './picker.variables.css'

const props = withDefaults(
  defineProps<{
    invalid?: boolean
    disabled?: boolean
    placeholder?: string
    clearable?: boolean
    maxDate?: Date
  }>(),
  {
    invalid: false,
    disabled: false,
    placeholder: 'DD/MM/YYYY',
    clearable: true,
    maxDate: undefined,
  },
)

const model = defineModel<string>()
const pickerRef = ref()

const formControl = useFormControlInject()
const isInvalid = computed(() => (formControl ? formControl.invalid?.value : props.invalid))
const isDisabled = computed(() => (formControl ? formControl.disabled?.value : props.disabled))

function handleChange($event: any) {
  model.value = $event ? toThaiTimezoneISOString(new Date($event)) : undefined
}
</script>
<template>
  <div>
    <VueDatePicker
      ref="pickerRef"
      :model-value="model"
      :max-date="maxDate"
      :hide-navigation="['time']"
      :locale="th"
      :placeholder="placeholder"
      :format="format"
      :class="
        cn({
          invalid: isInvalid,
        })
      "
      :disabled="isDisabled"
      @update:model-value="handleChange"
    >
      <template #input-icon>
        <Icon
          v-if="!model || isDisabled"
          name="ph:calendar-blank"
          class="mr-3 text-xl text-gray-60"
        />
      </template>
      <template #clear-icon="{ clear }">
        <template v-if="clearable">
          <Icon name="ph:x-circle" class="mr-3 text-xl text-gray-60" @click="clear" />
        </template>
        <template v-else>
          <Icon name="ph:calendar-blank" class="mr-3 text-xl text-gray-60" />
        </template>
      </template>

      <template #clock-icon>
        <Icon name="ph:clock" class="text-xl text-gray-60" />
      </template>

      <template #calendar-icon>
        <Icon name="ph:calendar-blank" class="mr-3 text-xl text-gray-60" />
      </template>

      <template #arrow-left>
        <Icon name="ph:caret-left" />
      </template>
      <template #arrow-right>
        <Icon name="ph:caret-right" />
      </template>
      <template #arrow-up>
        <Icon name="ph:caret-up" />
      </template>
      <template #arrow-down>
        <Icon name="ph:caret-down" />
      </template>

      <template #action-buttons="{ value }">
        <UiButton type="button" variant="secondary" size="sm" @click="pickerRef.closeMenu()">
          ยกเลิก
        </UiButton>
        <UiButton
          type="button"
          class="ml-2"
          size="sm"
          :disabled="!value"
          @click="pickerRef.selectDate()"
        >
          เลือก
        </UiButton>
      </template>
    </VueDatePicker>
  </div>
</template>
<style scoped>
@import url('./picker.style.css');
</style>
