<script setup lang="ts">
import { TransitionRoot, TransitionChild } from '@headlessui/vue'

withDefaults(
  defineProps<{
    open: boolean
    mobile?: boolean
    title?: string
    content?: string
    showCancelButton?: boolean
    showTextLink?: boolean
    cancelButtonText?: string
    textLinkText?: string
    confirmButtonText?: string
    loadingConfirmButton?: boolean
    variant?: 'primary' | 'warning' | 'danger'
  }>(),
  {
    open: false,
    title: undefined,
    content: undefined,
    showCancelButton: true,
    cancelButtonText: 'Cancel',
    confirmButtonText: 'Confirm',
    textLinkText: 'Link',
    variant: 'primary',
  },
)

const emit = defineEmits<{
  (e: 'confirm'): void
  (e: 'cancel'): void
  (e: 'link'): void
}>()

const isDelayConfirm = ref<boolean>(false)

function handleConfirmClick() {
  if (isDelayConfirm.value) return
  isDelayConfirm.value = true
  emit('confirm')
  setTimeout(() => {
    isDelayConfirm.value = false
  }, 200)
}
</script>

<template>
  <TransitionRoot appear :show="open" as="template">
    <div class="relative z-10">
      <TransitionChild
        as="template"
        enter="duration-300 ease-out"
        enter-from="opacity-0"
        enter-to="opacity-100"
        leave="duration-200 ease-in"
        leave-from="opacity-100"
        leave-to="opacity-0"
      >
        <div class="fixed inset-0 bg-black/25 backdrop-blur-sm" />
      </TransitionChild>

      <div class="fixed inset-0 overflow-y-auto">
        <div class="flex min-h-full items-center justify-center p-4">
          <TransitionChild
            as="template"
            enter="duration-300 ease-out"
            enter-from="opacity-0 scale-95"
            enter-to="opacity-100 scale-100"
            leave="duration-200 ease-in"
            leave-from="opacity-100 scale-100"
            leave-to="opacity-0 scale-95"
          >
            <div class="w-full max-w-140 rounded-lg bg-white p-6 shadow-xl transition-all">
              <h2
                v-if="title"
                class="hl-20px-700 mb-2"
                :class="mobile ? 'flex justify-center' : ''"
              >
                {{ title }}
              </h2>
              <slot>
                <p v-if="content" class="de-16px-400 wrap-break-word">
                  {{ content }}
                </p>
              </slot>

              <template v-if="mobile">
                <div class="mt-8 flex flex-col gap-4">
                  <UiButton
                    :loading="loadingConfirmButton"
                    :variant="variant"
                    @click="handleConfirmClick"
                  >
                    {{ confirmButtonText }}
                  </UiButton>
                  <UiButton v-if="showCancelButton" variant="secondary" @click="emit('cancel')">
                    {{ cancelButtonText }}
                  </UiButton>

                  <UiTextLink v-if="showTextLink" variant="secondary" @click="emit('link')">
                    <slot name="textLinkText">
                      {{ textLinkText }}
                    </slot>
                  </UiTextLink>
                </div>
              </template>
              <template v-else>
                <div class="mt-8 flex gap-4">
                  <UiTextLink v-if="showTextLink" variant="secondary" @click="emit('link')">
                    <slot name="textLinkText">
                      {{ textLinkText }}
                    </slot>
                  </UiTextLink>
                  <div class="ml-auto flex gap-4">
                    <UiButton v-if="showCancelButton" variant="secondary" @click="emit('cancel')">
                      {{ cancelButtonText }}
                    </UiButton>
                    <UiButton
                      :loading="loadingConfirmButton"
                      :variant="variant"
                      @click="handleConfirmClick"
                    >
                      {{ confirmButtonText }}
                    </UiButton>
                  </div>
                </div>
              </template>
            </div>
          </TransitionChild>
        </div>
      </div>
    </div>
  </TransitionRoot>
</template>
