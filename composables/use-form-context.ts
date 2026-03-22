import  {createInjectionState}  from '@vueuse/core'
import { useForm as veeValidateUseForm } from 'vee-validate'

const [useFormProvider, useFormInject] = createInjectionState(
  (state: ReturnType<typeof veeValidateUseForm>) => {
    function clearErrors({ errors, setFieldError }: ReturnType<typeof veeValidateUseForm>) {
      if (!errors?.value || !setFieldError) {
        return
      }

      return () => Object.keys(errors.value).forEach((e) => setFieldError(e, undefined))
    }

    function isAllFieldsValid(
      validateResults: { [key: string]: { errors: string[]; valid: boolean } },
      fieldList: string[],
    ) {
      const isAllFieldsValid = fieldList.every((e) => {
        return validateResults[e]?.valid
      })

      if (!isAllFieldsValid) {
        // eslint-disable-next-line no-console
        console.error(
          'List of invalid field: ',
          fieldList
            .filter((e) => {
              return !validateResults[e]?.valid
            })
            .map((e) => ({ key: e, value: validateResults[e] })),
        )
      }

      return isAllFieldsValid
    }

    function isFieldsValid(
      validateResults: { [key: string]: { errors: string[]; valid: boolean } },
      fieldList: string[],
    ) {
      const isAllFieldsValid = fieldList.every((e) => {
        return validateResults[e]?.valid
      })

      if (!isAllFieldsValid) {
        // eslint-disable-next-line no-console
        console.error(
          'List of invalid field: ',
          fieldList
            .filter((e) => {
              return !validateResults[e]?.valid
            })
            .map((e) => ({ key: e, value: validateResults[e] })),
        )
      }

      return isAllFieldsValid
    }

    return {
      ...state,
      clearErrors: clearErrors(state),
      isAllFieldsValid,
      isFieldsValid,
    }
  },
)

export { useFormProvider, useFormInject }
