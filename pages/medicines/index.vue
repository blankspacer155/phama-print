<script setup lang="ts">
import AddMedicineModal from '~/components/medicines/add-medicine-modal.vue';
import EditMedicineModal from '~/components/medicines/edit-medicine-modal.vue';
import type { Medicine, MedicineIntervalUnit } from '~/libs/types/medicine';
import { useMedicineStorage } from '~/composables/use-medicine-storage';
import {DEFAULT_MEDICINE_IDS} from '~/composables/use-medicine-storage'


      const { medicines,deleteMedicine,isFixedMedicine } = useMedicineStorage()
      const selectedMedicine = ref<Medicine>()
      const isOpenDeleteDialog = ref<boolean>(false)
      const isOpenAddMedicineModal = ref<boolean>(false)
      const isOpenEditMedicineModal = ref<boolean>(false)

      const sortedMedicines = computed(() => {
         return medicines.value.slice().sort((a, b) => {
            const aIsDefault = DEFAULT_MEDICINE_IDS.includes(a.id);
            const bIsDefault = DEFAULT_MEDICINE_IDS.includes(b.id);
            if (aIsDefault && !bIsDefault) {
               return -1; // a comes before b
            } else if (!aIsDefault && bIsDefault) {
               return 1; // b comes before a
            } else if (aIsDefault && bIsDefault) {
               return a.id.localeCompare(b.id); // sort by id if both are default
            } else{
               return 0; // maintain original order
            }
         });})

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

        function displayIntervals(intervals: number[], intervalUnit: MedicineIntervalUnit) {
           return intervals.map((interval, index) => {
              if (index === 0) {
                 return '0'
              } else {
                 return `${interval}`
              }
           }).join(' - ')+ (intervalUnit === 'DAY' ? ' วัน' : ' เดือน')
        }
</script>
<template>
   <main class="container my-16 ">
        <UiPanel variant="outline" class="px-6 py-6 flex flex-col items-center min-h-125">
            <div class=" w-full grid grid-cols-3 items-center">
               <div class="flex justify-start">
                  <UiButton @click="navigateTo('/')" class=" place-self-start">กลับ</UiButton>
               </div>
               <div class=" text-center">
                  <h1 class="text-2xl font-bold mb-4">รายชื่อยา</h1>
               </div>
            </div>
            <div class="self-end">
               <UiButton @click="isOpenAddMedicineModal = true">เพิ่มยา</UiButton>
            </div>
            <div v-if="medicines.length>0" class="flex flex-col  gap-2 w-full my-4  py-2">
               <div  class="grid grid-cols-4 gap-4 px-4 py-2 font-semibold">
                  <p>ชื่อยา</p>
                  <p>เวลาของแต่ละเข็ม</p>
                  <p>คำอธิบาย</p>
               </div>
               <template v-for="medicine in sortedMedicines" :key="medicine.id">
                  <UiPanel variant="gray2" class="grid grid-cols-4 gap-4 px-4 py-2">
                     <p>{{medicine.name}}</p>
                     <p>
                     {{ displayIntervals(medicine.intervals,medicine.interval_unit) }}
                     </p>
                     <p>{{ medicine.description }}</p>
                     <template v-if="!isFixedMedicine(medicine.id)">
                        <div class="flex justify-end">
                           <div class="flex gap-2 self-end ">
                           <UiButton @click="handleClickEditMedicine(medicine)">แก้ไข</UiButton>
                           <UiButton variant="danger" @click="handleClickDeleteMedicine(medicine)">ลบ</UiButton>
                           </div>
                        </div>
                     </template>
                  </UiPanel>
               </template>
            </div>
               <div v-else class="flex flex-col items-center gap-4 my-8 ">
                  <p class="text-gray-500">ยังไม่มีรายการยา</p>
               </div>
        </UiPanel>
        <UiDialog title="ยืนยันการลบยา" 
        :content="`คุณต้องการลบยา ${selectedMedicine?.name} หรือไม่?`" 
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

