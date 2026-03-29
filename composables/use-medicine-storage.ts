import { get, useStorage } from "@vueuse/core";
import { MEDICINE_INTERVAL_UNIT_LABELS } from "~/libs/constants";
import type { Medicine } from "~/libs/types/medicine";

export function useMedicineStorage(){
    const medicineStorage = useStorage<Medicine[]>('phama-print-medicines', []);

    return {
        medicines: medicineStorage,
        medicineOptions: [{ name: '-- กรุณาเลือกยา --', value: '' },...medicineStorage.value.map((medicine: Medicine) => ({ name: medicine.name, value: medicine.id }))],
        medicineIntervalUnitsOptions: Object.entries(MEDICINE_INTERVAL_UNIT_LABELS).map(([key,value]) => ({ name:value, value:key })),
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
        },
        getMedicineById: (id: string) => {
            return medicineStorage.value.find((m: Medicine) => m.id === id);
        },
        toggleDefaultMedicines: (targetId: string) =>{
            const index = medicineStorage.value.findIndex((m: Medicine) => m.id === targetId);
            if (index !== -1) {
                const prevValue = medicineStorage.value[index]!.is_default;
                // clear default flag for all medicines
                medicineStorage.value.forEach((medicine: Medicine) => {
                    medicine.is_default = false;
                })
                medicineStorage.value[index]!.is_default = !prevValue;
            }
        },
        getDefaultMedicineId:() => {
            const defaultMedicine = medicineStorage.value.find((m: Medicine) => m.is_default);
            return defaultMedicine ? defaultMedicine.id : null;
        }

    };
}