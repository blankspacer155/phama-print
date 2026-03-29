<script setup lang="ts">
import {useForm} from 'vee-validate'
import type { PatientRequest } from '~/libs/types/patient';
import { useFormProvider } from '@/composables/use-form-context';
import { useDoctorStorage } from '~/composables/use-doctor-storage';
import { usePatientPdf } from '~/composables/use-patient-pdf';
import { patientSchema } from '~/libs/validators/patient';

const emit = defineEmits<{
    (e:'submit', data: PatientRequest): void
}>()

const { doctorOptions } = useDoctorStorage()
const { medicineOptions } = useMedicineStorage()
const {generatePatientPdf} = usePatientPdf()
const form = useForm<PatientRequest>({
    validationSchema: toTypedSchema(patientSchema),
    initialValues: {
        doctorId: '',
        date: '',
        medicineId: ''
    }
})
useFormProvider(form)

const { defineField, resetForm, errors, validate } = form

const [doctorId] = defineField('doctorId')
const [date] = defineField('date')
const [medicineId] = defineField('medicineId')

async function handleSubmit(){
    const { valid } = await validate()
    if (!valid) return
    
    const body: PatientRequest = {
        doctorId: doctorId.value,
        date: date.value,
        medicineId: medicineId.value
    }
    generatePatientPdf(body)

    resetForm()
    emit('submit',body)
}

</script>

<template>
    <UiFormContainer >
        <UiPanel variant="outline" class="mb-4 py-6">
            <div class=" text-center ">
                <p class=" text-2xl font-bold">สร้างรายการนัด</p>
            </div>
            <div class="grid grid-cols-1 gap-4 p-6 lg:grid-cols-2">
                <UiFormControl   class="col-span-1 lg:col-span-2">
                    <UiFormLabel>หมอผู้ฉีด</UiFormLabel>
                    <UiSelect v-model="doctorId" :options="doctorOptions" placeholder="กรุณาเลือกหมอผู้ฉีด" />
                </UiFormControl>
                <UiFormControl :invalid="!!errors.medicineId" class="col-span-1 lg:col-span-2">
                    <UiFormLabel>ชื่อยา</UiFormLabel>
                    <UiSelect v-model="medicineId" :options="medicineOptions" placeholder="กรุณาเลือกชื่อยา" />
                    <UiFormErrorMessage>{{ errors.medicineId }}</UiFormErrorMessage>
                </UiFormControl>
                <UiFormControl :invalid="!!errors.date" class="col-span-1 lg:col-span-2">
                    <UiFormLabel>วันที่นัดหมาย</UiFormLabel>
                    <UiPickerDate v-model="date" placeholder="กรุณาเลือกวันที่นัดหมาย" />
                    <UiFormErrorMessage>{{ errors.date }}</UiFormErrorMessage>
                </UiFormControl>
            </div>
             <div class="flex w-full gap-4 px-4  justify-center">
                 <UiButton @click="navigateTo('/')">กลับ</UiButton>
                 <UiButton @click="handleSubmit">พิมพ์</UiButton>
            </div>
        </UiPanel>
       
         
    </UiFormContainer>
</template>