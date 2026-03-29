<script setup lang="ts">
import type { Doctor } from '~/libs/types/doctor';
import { useDoctorStorage } from '~/composables/use-doctor-storage';
import { doctorNameSchema } from '~/libs/validators/doctor';

const props = defineProps<{
   open?: boolean
   target?: Doctor
}>()
const emit = defineEmits<{
   (e: 'close'): void
   (e:'success'): void
}>()

const { updateDoctor,getDoctorByName } = useDoctorStorage()
const {values,defineField,validate,errors,setErrors,resetForm} = useForm({
    validationSchema: toTypedSchema(doctorNameSchema),
    initialValues: {
        name: props.target?.name || ''
    }
})
const [name] = defineField('name')

async function handleUpdateDoctor(){
     const {valid} = await validate()
    if(!valid || !values.name || !props.target) return
     //check duplicate name
       if(getDoctorByName(values.name) && getDoctorByName(values.name)?.name != props.target.name){
        setErrors({name: 'ชื่อหมอซ้ำ, กรุณาตรวจสอบใหม่อีกครั้ง'})
        return
    }

    // trim name before save
    const trimmedName = values.name.trimStart().trimEnd()
    updateDoctor({ ...props.target, name: trimmedName })
    resetForm()
    emit('success')
}

function handleClose(){
    resetForm()
    emit('close')
}

onUpdated(() => {
   name.value = props.target?.name || ''
})
</script>


<template>
   <UiModal :open="open" @close="handleClose">
    <UiModalHeader
        title="แก้ไขชื่อหมอ"
    />
    <UiModalBody>
        <UiFormControl :invalid="!!errors.name">
            <UiTextInput v-model="name" placeholder="ชื่อหมอ" />
            <UiFormErrorMessage>{{ errors.name }}</UiFormErrorMessage>
        </UiFormControl>
    </UiModalBody>
    <UiModalFooter
        secondary-button-text="ยกเลิก"
        primary-button-text="ยืนยัน"
        @primary="handleUpdateDoctor"
        @secondary="handleClose"
    />
   </UiModal>
</template>



