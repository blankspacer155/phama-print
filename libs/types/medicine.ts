import type { MEDICINE_INTERVAL_UNITS } from "../constants"

export type MedicineIntervalUnit = keyof typeof MEDICINE_INTERVAL_UNITS;
export interface Medicine{
    id: string // รหัสยา (auto generate)
    name:string // ชื่อยา
    description: string // รายละเอียดยา
    intervals : number[] // ระยะห่างระหว่างเข็ม (หน่วย)
    interval_unit: MedicineIntervalUnit; // หน่วยของระยะห่าง (วัน, เดือน)
}