import { useStorage } from "@vueuse/core";
import type { Medicine } from "~/libs/types/medicine";

export function useMedicineStorage(){
    const medicineStorage = useStorage<Medicine[]>('phama-print-medicines', []);

    return {
        medicines: medicineStorage,
        medicineOptions: [ ...medicineStorage.value ].map((medicine: Medicine) => ({ name: medicine.name, value: medicine.id })),
        addMedicine: (medicine: Medicine) => {
           medicineStorage.value.push(medicine);
        },
        updateMedicine: (updatedMedicine: Medicine) => {
            const index = medicineStorage.value.findIndex((m: Medicine) => m.id === updatedMedicine.id);
            if (index !== -1) {
                medicineStorage.value[index] = updatedMedicine;
            }
        },
        deleteMedicine: (medicine: Medicine) => {
            const updatedMedicines = medicineStorage.value.filter((m: Medicine) => m.id !== medicine.id);
            medicineStorage.value = updatedMedicines;
        }
    };
}