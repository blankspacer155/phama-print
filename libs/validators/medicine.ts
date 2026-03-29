import * as z from 'zod';

export const medicineSchema = z.object({
    name: z.string().trim().min(1, 'ข้อมูลไม่ถูกต้อง, กรุณาตรวจสอบใหม่อีกครั้ง'),
    description: z.string().trim().min(1, 'ข้อมูลไม่ถูกต้อง, กรุณาตรวจสอบใหม่อีกครั้ง'),   
})