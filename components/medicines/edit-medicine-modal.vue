<script setup lang="ts">
import {useForm} from 'vee-validate';
import { useMedicineStorage } from '~/composables/use-medicine-storage';
import type { Medicine } from '~/libs/types/medicine';
import { useFormProvider } from '@/composables/use-form-context';
import { medicineSchema } from '~/libs/validators/medicine';

const props = defineProps<{
   open?: boolean
   target?: Medicine
}>()
const emit = defineEmits<{
   (e: 'close'): void
   (e:'success'): void
}>()

const { updateMedicine, medicineIntervalUnitsOptions } = useMedicineStorage()
const form = useForm<Medicine>({
    validationSchema: toTypedSchema(medicineSchema),
    initialValues: {
        id: '',
        name: '',
        description: '',
        intervals: [0],
        interval_unit: 'DAY',
        is_default: false
    }
})
useFormProvider(form)
const {defineField,resetForm,errors,validate} = form

const [name] = defineField('name')
const [intervals] = defineField('intervals')
const [intervalUnit] = defineField('interval_unit')
const [description] = defineField('description')
const [isDefault] = defineField('is_default')


async function handleUpdateMedicine(){
    const {valid} = await validate()
    if(!valid ) return
    // TODO:: check duplicate name
        if (!props.target) return
        updateMedicine({...props.target,
            name: name.value, 
            description: description.value, 
            intervals: intervals.value, 
            interval_unit: intervalUnit.value, 
            is_default: isDefault.value} )
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

onUpdated(() => {
   name.value = props.target?.name || ''
   intervals.value = props.target?.intervals?.map((v) => v) || [0]
   intervalUnit.value = props.target?.interval_unit || 'DAY'
   description.value = props.target?.description || ''
   isDefault.value = props.target?.is_default || false
})
</script>


<template>
  <UiModal :open="open" @close="handleCloseModal">
    <UiModalHeader
        title="แก้ไขยา"
    />
    <UiModalBody>
       <UiFormContainer class=" flex flex-col gap-2">
         <UiFormControl :invalid="!!errors.name">
            <UiFormLabel>ชื่อยา</UiFormLabel>
            <UiTextInput v-model="name" placeholder="ชื่อยา" />
            <UiFormErrorMessage>{{ errors.name }}</UiFormErrorMessage>
        </UiFormControl>
        <UiFormControl :invalid="!!errors.description">
            <UiFormLabel>คำอธิบาย</UiFormLabel>
            <UiTextInput v-model="description" placeholder="คำอธิบาย" />
            <UiFormErrorMessage>{{ errors.description }}</UiFormErrorMessage>
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
                    <UiNumberInput v-model="intervals[index]"  placeholder="ระยะเวลาห่างเข็ม (วัน)" />
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
        @primary="handleUpdateMedicine"
        @secondary="handleCloseModal"
    />
   </UiModal>
</template>



