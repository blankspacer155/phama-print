<script setup lang="ts">
import {
  Listbox,
  ListboxButton,
  ListboxOptions,
  ListboxOption,
  TransitionRoot,
} from '@headlessui/vue'
import { useElementBounding } from '@vueuse/core'
import { useFormControlInject } from './form/form-control.context'
import { cn } from '@/libs/utils'

interface OptionData {
  name: string
  value: string | number
  disabled?: boolean
}
interface ElementBounding {
  left: number
  top: number
  width: number
  height: number
}

const model = defineModel<string | number>()

const props = withDefaults(
  defineProps<{
    options: OptionData[]
    placeholder?: string
    disabled?: boolean
    invalid?: boolean
    loading?: boolean
    clearable?: boolean
    teleport?: boolean
  }>(),
  {
    placeholder: '',
    invalid: false,
    clearable: true,
    teleport: false,
  },
)

const inputRef = ref<HTMLButtonElement | null>(null)
const { top, height, left, width } = useElementBounding(inputRef)
const inputOriginBounding = ref<ElementBounding>({
  left: 0,
  top: 0,
  width: 0,
  height: 0,
})

const formControl = useFormControlInject()
const id = computed(() => (formControl ? formControl.id : undefined))
const isInvalid = computed(() => (formControl ? formControl.invalid?.value : props.invalid))
const isDisabled = computed(() => (formControl ? formControl.disabled?.value : props.disabled))


const selected = computed(() => props.options.find((e) => e.value === model.value))


onMounted(() => {
  inputOriginBounding.value = {
    left: left.value,
    top: top.value,
    width: width.value,
    height: height.value,
  }
})
</script>

<template>
  <Listbox
    :model-value="selected"
    :disabled="isDisabled"
    @update:model-value="model = ($event as OptionData).value"
  >
    <div class="relative">

       <ListboxButton
          :class="
          cn(
            'hl-16px-400 h-10 w-full rounded border border-input-field-border pl-3 pr-11 placeholder:font-hl placeholder:text-gray-60 focus:border-input-field-border-focused focus:ring-4 focus:ring-input-field-border-focused-effect focus-visible:outline-none disabled:bg-input-field-bg-disable disabled:text-gray-60',
            {
              'border-input-field-border-invalid focus:border-input-field-border-invalid':
                !!isInvalid,
              'pr-16': !!model && clearable,
            },
          )
        "
        >
          <span class="block truncate text-left">{{selected?.name  }}</span>
          <span
            class=" absolute inset-y-0 right-0 flex items-center pr-2"
          >
            <Icon name="ph:caret-down" class="text-2xl text-gray-60" />
          </span>
        </ListboxButton>

      <Teleport to="body" :disabled="!teleport">
        <TransitionRoot
          leave="transition ease-in duration-100"
          leave-from="opacity-100"
          leave-to="opacity-0"
        >
          <ListboxOptions
            class="absolute z-20 mt-1 flex max-h-64 min-w-full max-w-full flex-col gap-2 overflow-auto rounded bg-white p-2 shadow-lg focus:outline-none"
            :style="
              props.teleport
                ? {
                    top: `${inputOriginBounding.top + height}px`,
                    left: `${left}px`,
                    'min-width': `${width}px`,
                    'max-width': `${width}px`,
                  }
                : {}
            "
          >
            <div
              v-if="options.length === 0"
              class="hl-16px-400 flex h-10 items-center truncate rounded px-3 py-2 text-left text-gray-80"
            >
              ไม่มีข้อมูล
            </div>

            <div
              v-if="loading"
              class="hl-14px-400 flex h-10 items-center gap-2 truncate rounded px-3 py-2 text-left text-gray-80"
            >
              <Icon name="ph:circle-notch " class="shrink-0 animate-spin text-xl" />
              <span class="truncate">กำลังดาวน์โหลดข้อมูล</span>
            </div>

            <ListboxOption
              v-for="(option, index) in options"
              :key="index"
              as="template"
              :value="option"
              :disabled="option.disabled"
            >
              <li
                :title="option.name"
                :class="
                  cn(
                    'hl-16px-400 flex h-10 shrink-0 cursor-pointer items-center truncate rounded px-3 py-2 text-left text-gray-80 hover:bg-gray-20 hover:text-gray-100 active:bg-feedback-bg-clicked active:text-gray-100',
                    {
                      'text-primary hover:text-primary': model === option.value,
                      'pointer-events-none cursor-not-allowed bg-gray-20 text-gray-50':
                        option.disabled,
                    },
                  )
                "
              >
                <span class="block truncate">
                  {{ option.name }}
                </span>
              </li>
            </ListboxOption>
          </ListboxOptions>
        </TransitionRoot>
      </Teleport>
    </div>
  </Listbox>
</template>
