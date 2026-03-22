import { createInjectionState } from '@vueuse/core'

interface FormControlState {
  id: string
  invalid?: ComputedRef<boolean>
  required?: ComputedRef<boolean>
  disabled?: ComputedRef<boolean>
}

const [useFormControlProvider, useFormControlInject] = createInjectionState(
  (state: FormControlState) => state,
)

export { useFormControlProvider, useFormControlInject }
