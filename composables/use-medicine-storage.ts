import { get, useStorage } from "@vueuse/core";
import { MEDICINE_INTERVAL_UNIT_LABELS } from "~/libs/constants";
import type { Medicine } from "~/libs/types/medicine";

const DEFAULT_MEDICINE_ID = 'default';
const DEFAULT_MEDICINE: Medicine = {
    id: DEFAULT_MEDICINE_ID,
    name: 'ยาเริ่มต้น',
    description: 'ยาที่ถูกตั้งเป็นค่าเริ่มต้นสำหรับการคำนวณยา test',
    intervals: [0,1,2],
    interval_unit: 'MONTH',
    is_default: true
}

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
        },
        setDefaultMedicine: ()=>{
            // find if default medicine exist
            const defaultMedicineIndex = medicineStorage.value.findIndex((m: Medicine) => m.id === DEFAULT_MEDICINE_ID);
            if(defaultMedicineIndex === -1){
                // not found , reset is_default and push default medicine
                 medicineStorage.value.forEach((medicine: Medicine) => {
                    medicine.is_default = false;
                })
                medicineStorage.value.push(DEFAULT_MEDICINE);
            }else{
                // found , compare change
                const oldValue= medicineStorage.value[defaultMedicineIndex]!
                if(oldValue.id!== DEFAULT_MEDICINE.id 
                    || oldValue.name !== DEFAULT_MEDICINE.name
                    || oldValue.description !== DEFAULT_MEDICINE.description
                    || oldValue.interval_unit !== DEFAULT_MEDICINE.interval_unit
                    || JSON.stringify(oldValue.intervals) !== JSON.stringify(DEFAULT_MEDICINE.intervals)
                ){
                    // have change, reset is_default and assign new change
                    medicineStorage.value.forEach((medicine: Medicine) => {
                    medicine.is_default = false;})
                    medicineStorage.value[defaultMedicineIndex] = {
                        ...DEFAULT_MEDICINE,
                    }
                }else{
                    // no change
                }
            }
            
        },
        isFixedMedicine: (medicineId: string) => {
            return medicineId === DEFAULT_MEDICINE_ID;
        }

    };
}