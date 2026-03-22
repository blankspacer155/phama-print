<script setup lang="ts">
import type { Doctor } from '~/libs/types/doctor';
import { useDoctorStorage } from '~/composables/use-doctor-storage';

const props = defineProps<{
   open?: boolean
   target?: Doctor
}>()
const emit = defineEmits<{
   (e: 'close'): void
   (e:'success'): void
}>()

const { updateDoctor } = useDoctorStorage()
const name = ref<string>(props.target?.name || '')
     // TODO :: add form control

function handleUpdateDoctor(){
     // TODO:: check duplicate name
    if (props.target) {
        updateDoctor({ ...props.target, name: name.value })
        emit('success')
    }
}

onUpdated(() => {
   name.value = props.target?.name || ''
})
</script>


<template>
   <UiModal :open="open" @close="$emit('close')">
    <UiModalHeader
        title="แก้ไขชื่อหมอ"
    />
    <UiModalBody>
        <UiFormControl required>
            <UiTextInput v-model="name" placeholder="ชื่อหมอ" />
        </UiFormControl>
    </UiModalBody>
    <UiModalFooter
        secondary-button-text="ยกเลิก"
        primary-button-text="ยืนยัน"
        @primary="handleUpdateDoctor"
        @secondary="emit('close')"
    />
   </UiModal>
</template>



