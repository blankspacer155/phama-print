<script setup lang="ts">
import { TransitionRoot, TransitionChild, Dialog, DialogPanel } from '@headlessui/vue'
import { useModalProvider } from './modal.context'

const props = withDefaults(
  defineProps<{
    open: boolean
    width?: number
    variant?: 'primary' | 'warning' | 'danger'
    closeOnClickOutside?: boolean
  }>(),
  {
    open: false,
    width: 560,
    variant: 'primary',
  },
)

const emit = defineEmits<{
  (e: 'close'): void
}>()

const width = computed(() => `${props.width}px`)

function scrollModalTo(options: any) {
  const modalAreaEl = modalAreaRef.value
  if (modalAreaEl) modalAreaEl.scrollTo(options)
}

function closeModal() {
  emit('close')
}

useModalProvider({
  closeModal,
  variant: props.variant,
})

defineExpose({
  scrollModalTo,
})

const modalAreaRef = ref<HTMLDivElement | null>(null)
</script>

<template>
  <TransitionRoot appear :show="open" as="template">
    <Dialog
      as="div"
      class="relative z-20"
      @close="() => (closeOnClickOutside ? emit('close') : '')"
    >
      <TransitionChild
        as="template"
        enter="duration-300 ease-out"
        enter-from="opacity-0"
        enter-to="opacity-100"
        leave="duration-100 ease-in"
        leave-from="opacity-100"
        leave-to="opacity-0"
      >
        <div class="fixed inset-0 bg-black/25 backdrop-blur-sm" />
      </TransitionChild>

      <div ref="modalAreaRef" class="fixed inset-0 overflow-y-auto">
        <div class="flex min-h-full items-center justify-center p-4">
          <TransitionChild
            as="template"
            enter="duration-300 ease-out"
            enter-from="opacity-0 scale-95"
            enter-to="opacity-100 scale-100"
            leave="duration-100 ease-in"
            leave-from="opacity-100 scale-100"
            leave-to="opacity-0 scale-95"
          >
            <DialogPanel
              class="w-full rounded-lg bg-white shadow-xl transition-all"
              :style="{ maxWidth: width }"
            >
              <slot />
            </DialogPanel>
          </TransitionChild>
        </div>
      </div>
    </Dialog>
  </TransitionRoot>
</template>
