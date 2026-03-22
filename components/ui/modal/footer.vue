<script setup lang="ts">
import { useModalInject } from './modal.context'

withDefaults(
  defineProps<{
    showPrimaryButton?: boolean
    showSecondaryButton?: boolean
    showTextLink?: boolean

    primaryButtonText?: string
    secondaryButtonText?: string
    textLinkText?: string

    disabledPrimaryButton?: boolean
    disabledSecondaryButton?: boolean
    disabledTextLink?: boolean

    loadingPrimaryButton?: boolean
    loadingSecondaryButton?: boolean
    loadingTextLink?: boolean
  }>(),
  {
    showSecondaryButton: true,
    primaryButtonText: 'Button',
    secondaryButtonText: 'Button',
    textLinkText: 'Button',
  },
)

const emit = defineEmits<{
  (e: 'primary'): void
  (e: 'secondary'): void
  (e: 'link'): void
}>()

const { variant } = useModalInject()

const isDelayPrimary = ref<boolean>(false)

function handlePrimaryClick() {
  if (isDelayPrimary.value) return
  isDelayPrimary.value = true
  emit('primary')
  setTimeout(() => {
    isDelayPrimary.value = false
  }, 200)
}
</script>

<template>
  <footer class="flex flex-col gap-4 border-t border-gray-30 p-6 sm:flex-row">
    <slot>
      <UiTextLink
        v-if="showTextLink"
        type="button"
        variant="secondary"
        class="order-2 sm:order-1"
        :loading="loadingTextLink"
        :disabled="disabledTextLink"
        @click="emit('link')"
      >
        <slot name="textLinkText">
          {{ textLinkText }}
        </slot>
      </UiTextLink>
      <div class="order-1 flex flex-col gap-4 sm:order-2 sm:ml-auto sm:flex-row">
        <UiButton
          v-if="showSecondaryButton"
          type="button"
          variant="secondary"
          class="order-2 sm:order-1"
          :loading="loadingSecondaryButton"
          :disabled="disabledSecondaryButton"
          @click="emit('secondary')"
        >
          <slot name="secondaryButtonText">
            {{ secondaryButtonText }}
          </slot>
        </UiButton>
        <UiButton
          class="order-1 sm:order-2"
          :variant="variant"
          type="button"
          :loading="loadingPrimaryButton"
          :disabled="disabledPrimaryButton"
          @click="handlePrimaryClick"
        >
          <slot name="primaryButtonText">
            {{ primaryButtonText }}
          </slot>
        </UiButton>
      </div>
    </slot>
  </footer>
</template>
