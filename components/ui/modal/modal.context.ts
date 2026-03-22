import { createInjectionState } from '@vueuse/shared'

interface StepperState {
  closeModal: () => void
  variant: string
}

const [useModalProvider, useModalInject] = createInjectionState((state: StepperState) => state)

export { useModalProvider, useModalInject }
