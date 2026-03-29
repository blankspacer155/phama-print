import * as z from 'zod';

export const patientSchema = z.object({
    medicineId: z.string().min(1,'ข้อมูลไม่ถูกต้อง, กรุณาตรวจสอบใหม่อีกครั้ง'),
    date: z.string().min(1,'ข้อมูลไม่ถูกต้อง, กรุณาตรวจสอบใหม่อีกครั้ง'),
    doctorId: z.string().optional(), 
})