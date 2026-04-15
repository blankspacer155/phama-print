<script setup lang="ts">
import { useDoctorStorage } from '~/composables/use-doctor-storage';
import { doctorNameSchema } from '~/libs/validators/doctor';

const props = defineProps<{
   open?: boolean
}>()
const emit = defineEmits<{
   (e: 'close'): void
   (e:'success'): void
}>()

const { addDoctor,getDoctorByName } = useDoctorStorage()
const {values,defineField,validate,errors,setErrors,resetForm} = useForm({
    validationSchema: toTypedSchema(doctorNameSchema),
    initialValues: {
        name: ''
    }
})
const [name] = defineField('name')


async function handleAddDoctor(){
    const {valid} = await validate()
    if(!valid || !values.name) return

    // check duplicate name
    if(getDoctorByName(values.name)){
        setErrors({name: 'ชื่อผู้ฉีดซ้ำ, กรุณาตรวจสอบใหม่อีกครั้ง'})
        return
    }

    // trim name before save
    const trimmedName = values.name.trimStart().trimEnd()
    addDoctor({ id: crypto.randomUUID(), name: trimmedName })
    resetForm()
    emit('success')
}

function handleClose(){
    resetForm()
    emit('close')
}

</script>


<template>
   <UiModal :open="open" @close="handleClose">
    <UiModalHeader
        title="เพิ่มชื่อผู้ฉีด"
    />
    <UiModalBody>
        <UiFormControl  :invalid="!!errors.name" >
            <UiTextInput v-model="name" placeholder="ชื่อผู้ฉีด" />
            <UiFormErrorMessage>{{ errors.name }}</UiFormErrorMessage>
        </UiFormControl>
    </UiModalBody>
    <UiModalFooter
        secondary-button-text="ยกเลิก"
        primary-button-text="ยืนยัน"
        @primary="handleAddDoctor"
        @secondary="handleClose"
    />
   </UiModal>
</template>



