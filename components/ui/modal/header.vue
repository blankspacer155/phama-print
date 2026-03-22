<script setup lang="ts">
import { useModalInject } from './modal.context'
withDefaults(
  defineProps<{
    title?: string
    subtitle?: string
    hideCloseButton?: boolean
  }>(),
  {
    title: undefined,
    subtitle: undefined,
  },
)

const { closeModal } = useModalInject()
</script>

<template>
  <header
    class="relative min-h-[52px] px-6 pt-6"
    :class="hideCloseButton ? 'flex justify-center' : ''"
  >
    <div class="flex flex-col gap-1">
      <h2 v-if="title" class="hl-20px-700 pr-8">{{ title }}</h2>
      <p v-if="subtitle" class="de-14px-400 break-words text-gray-70">{{ subtitle }}</p>
    </div>
    <template v-if="!hideCloseButton">
      <UiIconButton
        name="ph:x"
        variant="secondary-ghost"
        class="absolute right-4 top-4"
        @click="closeModal"
      />
    </template>
  </header>
</template>
