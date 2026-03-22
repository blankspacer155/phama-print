<script setup lang="ts">
import AddDoctorModal from '~/components/doctors/add-doctor-modal.vue';
import EditDoctorModal from '~/components/doctors/edit-doctor-modal.vue';
import type { Doctor } from '~/libs/types/doctor';
import { useDoctorStorage } from '~/composables/use-doctor-storage';


      const { doctors,deleteDoctor } = useDoctorStorage()
      const selectedDoctor = ref<Doctor>()
      const isOpenDeleteDialog = ref<boolean>(false)
      const isOpenAddDoctorModal = ref<boolean>(false)
      const isOpenEditDoctorModal = ref<boolean>(false)

        function handleClickDeleteDoctor(target: Doctor) {
         isOpenDeleteDialog.value = true;
         selectedDoctor.value = target

        }
        function handleDeleteDoctor() {
           if (!selectedDoctor.value) return
            deleteDoctor(selectedDoctor.value)
           isOpenDeleteDialog.value = false
        }
        function handleClickEditDoctor(target: Doctor) {
         selectedDoctor.value = target
         isOpenEditDoctorModal.value = true
        }
</script>
<template>
   <main class="container my-16">
        <UiPanel variant="outline" class="px-6 py-6 flex flex-col items-center">
            <div>
               <h1 class="text-2xl font-bold mb-4">รายชื่อหมอ</h1>
            </div>
            <div class="self-end">
               <UiButton @click="isOpenAddDoctorModal = true">เพิ่มหมอ</UiButton>
            </div>
            <div class="flex flex-col  gap-2 w-full my-4  py-2">
               <template v-for="doctor in doctors" :key="doctor.id">
               <UiPanel variant="gray2" class="flex gap-4 justify-between px-4 py-2">
                  <p>{{doctor.name}}</p>
                  <div class="flex gap-2">
                     <UiButton @click="handleClickEditDoctor(doctor)">edit</UiButton>
                     <UiButton variant="danger" @click="handleClickDeleteDoctor(doctor)">delete</UiButton>
                  </div>
                 
               </UiPanel>
                  </template>
             
            </div>
        </UiPanel>
        <UiDialog title="ยืนยันการลบชื่อ" 
        :content="`คุณต้องการลบชื่อ ${selectedDoctor?.name} หรือไม่?`" 
        :open="isOpenDeleteDialog" 
        variant="danger" 
        confirmButtonText="ลบ" 
        cancel-button-text="ยกเลิก"
        showCancelButton
        @cancel="isOpenDeleteDialog = false"
        @confirm="handleDeleteDoctor"
        />
        <AddDoctorModal
        :open="isOpenAddDoctorModal"
         @close="isOpenAddDoctorModal = false"
         @success="isOpenAddDoctorModal = false"
        />
        <EditDoctorModal
        :open="isOpenEditDoctorModal"
        :target="selectedDoctor"
        @close="isOpenEditDoctorModal = false"
        @success="isOpenEditDoctorModal = false"
        />

   </main>
</template>

