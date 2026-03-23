<script setup lang="ts">
import {useForm} from 'vee-validate';
import { useMedicineStorage } from '~/composables/use-medicine-storage';
import type { Medicine } from '~/libs/types/medicine';
import { useFormProvider } from '@/composables/use-form-context';

const props = defineProps<{
   open?: boolean
}>()
const emit = defineEmits<{
   (e: 'close'): void
   (e:'success'): void
}>()

const { addMedicine, medicineIntervalUnitsOptions } = useMedicineStorage()
const form = useForm<Medicine>({
    initialValues: {
        id: '',
        name: '',
        description: '',
        intervals: [0],
        interval_unit: 'DAY'
    }
})
useFormProvider(form)
const {defineField,resetForm} = form

const [name] = defineField('name')
const [intervals] = defineField('intervals')
const [intervalUnit] = defineField('interval_unit')
const [description] = defineField('description')


    // TODO :: add form control

function handleAddMedicine(){

    // TODO:: check duplicate name
    const newMedicine: Medicine = {
        id: crypto.randomUUID(),
        name: name.value,
        description: description.value,
        intervals: intervals.value,
        interval_unit: intervalUnit.value
    }
    addMedicine(newMedicine)
    resetForm()
    emit('success')
}
function handleAddInterval(){
   intervals.value.push(0)
}
function handleDecreaseInterval(){
   if (intervals.value.length > 1) {
      intervals.value.splice(intervals.value.length - 1, 1)
   }
}
function handleCloseModal(){
   resetForm()
   emit('close')
}
</script>


<template>
   <UiModal :open="open" @close="$emit('close')">
    <UiModalHeader
        title="เพิ่มยา"
    />
    <UiModalBody>
    <UiFormContainer class=" flex flex-col gap-2">
        <UiFormControl>
            <UiFormLabel>ชื่อยา</UiFormLabel>
            <UiTextInput v-model="name" placeholder="ชื่อยา" />
        </UiFormControl>
        <UiFormControl>
            <UiFormLabel>คำอธิบาย</UiFormLabel>
            <UiTextInput v-model="description" placeholder="คำอธิบาย" />
        </UiFormControl>
        <div class="flex gap-2  py-4 justify-between">
            <div class="flex gap-2">
                <UiButton @click="handleAddInterval">เพิ่มเข็ม</UiButton>
                <UiButton @click="handleDecreaseInterval">ลดเข็ม</UiButton>
            </div>
            <div>
                <UiSelect v-model="intervalUnit" :options="medicineIntervalUnitsOptions"  />
            </div>
        </div>
        <div class="grid grid-cols-2 gap-2">
            <template v-for="(_, index) in intervals" :key="index">
                <UiFormLabel>ระยะเวลาห่างเข็มที่ {{index+1}}</UiFormLabel>
                <div class="flex gap-2">
                <UiFormControl :disabled="index==0" required>
                    <UiNumberInput v-model="intervals[index]"  :placeholder="`ระยะเวลาห่างเข็ม (${intervalUnit === 'DAY' ? 'วัน' : 'เดือน'})`" />
                </UiFormControl> 
                <p>{{ intervalUnit === 'DAY' ? 'วัน' : 'เดือน' }}</p>
                </div>       
            </template>
        </div>
    </UiFormContainer>   
    </UiModalBody>
    <UiModalFooter
        secondary-button-text="ยกเลิก"
        primary-button-text="ยืนยัน"
        @primary="handleAddMedicine"
        @secondary="handleCloseModal"
    />
   </UiModal>
</template>



