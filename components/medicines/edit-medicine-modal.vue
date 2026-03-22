<script setup lang="ts">
import { useMedicineStorage } from '~/composables/use-medicine-storage';
import type { Medicine } from '~/libs/types/medicine';

const props = defineProps<{
   open?: boolean
   target?: Medicine
}>()
const emit = defineEmits<{
   (e: 'close'): void
   (e:'success'): void
}>()

const { updateMedicine } = useMedicineStorage()
const name = ref<string>('')
const intervals = ref<number[]>([0])

const modifiedIntervals = ref<number[]>([0])
    // TODO :: add form control

function handleUpdateMedicine(){

    // TODO:: check duplicate name
    if (props.target) {
        updateMedicine({ ...props.target, name: name.value, intervals: intervals.value })
        emit('success')
    }
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
   emit('close')
}

onUpdated(() => {
   name.value = props.target?.name || ''
   intervals.value = props.target?.intervals?.map((v) => v) || [0]
})
</script>


<template>
  <UiModal :open="open" @close="$emit('close')">
    <UiModalHeader
        title="แก้ไขยา"
    />
    <UiModalBody>
    <UiFormContainer>
        <UiFormControl required>
            <UiTextInput v-model="name" placeholder="ชื่อยา" />
        </UiFormControl>
        <div class="flex gap-2  py-4">
            <UiButton @click="handleAddInterval">เพิ่มเข็ม</UiButton>
            <UiButton @click="handleDecreaseInterval">ลดเข็ม</UiButton>
        </div>
        <div class="grid grid-cols-2 gap-2">
            <template v-for="(_, index) in intervals" :key="index">
                <UiFormLabel>ระยะเวลาห่างเข็มที่ {{index+1}}</UiFormLabel>
                <div class="flex gap-2">
                <UiFormControl :disabled="index==0" required>
                    <UiNumberInput v-model="intervals[index]"  placeholder="ระยะเวลาห่างเข็ม (วัน)" />
                </UiFormControl> 
                <p>วัน</p>
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



