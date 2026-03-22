<script setup lang="ts">
import { useDoctorStorage } from '~/composables/use-doctor-storage';

const props = defineProps<{
   open?: boolean
}>()
const emit = defineEmits<{
   (e: 'close'): void
   (e:'success'): void
}>()

const { addDoctor } = useDoctorStorage()
const name = ref<string>('')
    // TODO :: add form control

function handleAddDoctor(){

    // TODO:: check duplicate name
    
    addDoctor({ id: crypto.randomUUID(), name: name.value })
    name.value = ''
    emit('success')
}

</script>


<template>
   <UiModal :open="open" @close="$emit('close')">
    <UiModalHeader
        title="เพิ่มชื่อหมอ"
    />
    <UiModalBody>
        <UiFormControl required>
            <UiTextInput v-model="name" placeholder="ชื่อหมอ" />
        </UiFormControl>
    </UiModalBody>
    <UiModalFooter
        secondary-button-text="ยกเลิก"
        primary-button-text="ยืนยัน"
        @primary="handleAddDoctor"
        @secondary="emit('close')"
    />
   </UiModal>
</template>



