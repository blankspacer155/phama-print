import { get, useStorage } from "@vueuse/core";
import { MEDICINE_INTERVAL_UNIT_LABELS } from "~/libs/constants";
import type { Medicine } from "~/libs/types/medicine";

export const DEFAULT_MEDICINE_IDS = ['default', 'default1'];
const DEFAULT_MEDICINES: Medicine[] = [{
    id: DEFAULT_MEDICINE_IDS[0]!,
    name: 'วัคซีนไวรัสตับอักเสบ บี (HB vacc.; CKD3-4)',
    description: 'ฉีดเข้ากล้ามเนื้อ 20 mcg ที่ 0, 1, 2 และ 6 เดือน',
    intervals: [0,1,2,6],
    interval_unit: 'MONTH',
    is_default: true
},
{
    id: DEFAULT_MEDICINE_IDS[1]!,
    name: 'วัคซีนไวรัสตับอักเสบ บี (HB vacc.; CKD5 ขึ้นไป)',
    description: 'ฉีดเข้ากล้ามเนื้อ 40 mcg ที่ 0, 1, 2 และ 6 เดือน',
    intervals: [0,1,2,6],
    interval_unit: 'MONTH',
    is_default: false
}]

export function useMedicineStorage(){
    const medicineStorage = useStorage<Medicine[]>('phama-print-medicines', []);

    return {
        medicines: medicineStorage,
        medicineOptions: [{ name: '-- กรุณาเลือกยา --', value: '' },...medicineStorage.value.map((medicine: Medicine) => ({ name: medicine.name, value: medicine.id })).sort((a, b) => {
            const aIsDefault = DEFAULT_MEDICINE_IDS.includes(a.value);
            const bIsDefault = DEFAULT_MEDICINE_IDS.includes(b.value);
            if (aIsDefault && !bIsDefault) {
               return -1; // a comes before b
            } else if (!aIsDefault && bIsDefault) {
               return 1; // b comes before a
            } else if (aIsDefault && bIsDefault) {
               return a.value.localeCompare(b.value); // sort by id if both are default
            } else{
               return 0; // maintain original order
            }
         })],
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
        },
        setDefaultMedicines: () => {
            DEFAULT_MEDICINES.forEach((defaultMed) => {
                // Find if this specific default medicine exists in storage by ID
                const index = medicineStorage.value.findIndex((m: Medicine) => m.id === defaultMed.id);

                if (index === -1) {
                    // 1. Not found: Add it to the storage
                    medicineStorage.value.push({ ...defaultMed });
                } else {
                    // 2. Found: Check for changes in details
                    const existingMed = medicineStorage.value[index]!;
                    
                    const hasChanged = 
                        existingMed.name !== defaultMed.name ||
                        existingMed.description !== defaultMed.description ||
                        existingMed.interval_unit !== defaultMed.interval_unit ||
                        JSON.stringify(existingMed.intervals) !== JSON.stringify(defaultMed.intervals);

                    if (hasChanged) {
                        // Keep the user's current 'is_default' preference but update the medical data
                        const currentStatus = existingMed.is_default;
                        medicineStorage.value[index] = { 
                            ...defaultMed, 
                            is_default: currentStatus 
                        };
                    }
                }
            });

            // Optional: If you want to ensure at least ONE medicine is set as default 
            // if none are currently selected
            const hasAnyDefault = medicineStorage.value.some(m => m.is_default);
            if (!hasAnyDefault && medicineStorage.value.length > 0) {
                medicineStorage.value[0]!.is_default = true;
            }
        },
        isFixedMedicine: (medicineId: string) => {
           return DEFAULT_MEDICINE_IDS.includes(medicineId);
        }

    };
}