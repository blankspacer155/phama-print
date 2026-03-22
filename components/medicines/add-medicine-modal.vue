<script setup lang="ts">
import { useMedicineStorage } from '~/composables/use-medicine-storage';
import type { MEDICINE_INTERVAL_UNITS } from '~/libs/constants';
import type { MedicineIntervalUnit } from '~/libs/types/medicine';

const props = defineProps<{
   open?: boolean
}>()
const emit = defineEmits<{
   (e: 'close'): void
   (e:'success'): void
}>()

const { addMedicine, medicineIntervalUnitsOptions } = useMedicineStorage()
const name = ref<string>('')
const intervals = ref<number[]>([0])
const intervalUnit = ref<MedicineIntervalUnit>('DAY')
    // TODO :: add form control

function handleAddMedicine(){

    // TODO:: check duplicate name
    addMedicine({ id: crypto.randomUUID(), name: name.value, intervals: intervals.value, interval_unit: intervalUnit.value })
    name.value = ''
    intervals.value = [0]
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
   name.value = ''
   intervals.value = [0]
   intervalUnit.value = 'DAY'
   emit('close')
}
</script>


<template>
   <UiModal :open="open" @close="$emit('close')">
    <UiModalHeader
        title="เพิ่มยา"
    />
    <UiModalBody>
    <UiFormContainer>
        <UiFormControl required>
            <UiTextInput v-model="name" placeholder="ชื่อยา" />
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



