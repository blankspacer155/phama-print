<script setup lang="ts">
import AddMedicineModal from '~/components/medicines/add-medicine-modal.vue';
import EditMedicineModal from '~/components/medicines/edit-medicine-modal.vue';
import type { Medicine } from '~/libs/types/medicine';
import { useMedicineStorage } from '~/composables/use-medicine-storage';


      const { medicines,deleteMedicine } = useMedicineStorage()
      const selectedMedicine = ref<Medicine>()
      const isOpenDeleteDialog = ref<boolean>(false)
      const isOpenAddMedicineModal = ref<boolean>(false)
      const isOpenEditMedicineModal = ref<boolean>(false)

        function handleClickDeleteMedicine(target: Medicine) {
         isOpenDeleteDialog.value = true;
         selectedMedicine.value = target

        }
        function handleDeleteMedicine() {
           if (!selectedMedicine.value) return
            deleteMedicine(selectedMedicine.value)
           isOpenDeleteDialog.value = false
        }
        function handleClickEditMedicine(target: Medicine) {
         selectedMedicine.value = target
         isOpenEditMedicineModal.value = true
        }

        function displayIntervals(intervals: number[]) {
           return intervals.map((interval, index) => {
              if (index === 0) {
                 return '0'
              } else {
                 return `${interval}`
              }
           }).join(' - ')+ ' วัน'
        }
</script>
<template>
   <main class="container my-16">
        <UiPanel variant="outline" class="px-6 py-6 flex flex-col items-center">
            <div>
               <h1 class="text-2xl font-bold mb-4">รายชื่อยา</h1>
            </div>
            <div class="self-end">
               <UiButton @click="isOpenAddMedicineModal = true">เพิ่มยา</UiButton>
            </div>
            <div class="flex flex-col  gap-2 w-full my-4  py-2">
               <template v-for="medicine in medicines" :key="medicine.id">
               <UiPanel variant="gray2" class="grid grid-cols-3 gap-4 px-4 py-2">
                  <p>{{medicine.name}}</p>
                  <p>
                    {{ displayIntervals(medicine.intervals) }}
                  </p>
                  <div class="flex justify-end">
                     <div class="flex gap-2 self-end ">
                     <UiButton @click="handleClickEditMedicine(medicine)">edit</UiButton>
                     <UiButton variant="danger" @click="handleClickDeleteMedicine(medicine)">delete</UiButton>
                  </div>
                  </div>
                 
                 
               </UiPanel>
                  </template>
             
            </div>
        </UiPanel>
        <UiDialog title="ยืนยันการลบชื่อ" 
        :content="`คุณต้องการลบชื่อ ${selectedMedicine?.name} หรือไม่?`" 
        :open="isOpenDeleteDialog" 
        variant="danger" 
        confirmButtonText="ลบ" 
        cancel-button-text="ยกเลิก"
        showCancelButton
        @cancel="isOpenDeleteDialog = false"
        @confirm="handleDeleteMedicine"
        />
        <AddMedicineModal
        :open="isOpenAddMedicineModal"
         @close="isOpenAddMedicineModal = false"
         @success="isOpenAddMedicineModal = false"
        />
        <EditMedicineModal
        :open="isOpenEditMedicineModal"
        :target="selectedMedicine"
        @close="isOpenEditMedicineModal = false"
        @success="isOpenEditMedicineModal = false"
        />

   </main>
</template>

