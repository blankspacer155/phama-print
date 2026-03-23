import pdfMake from "pdfmake/build/pdfmake";
import * as pdfFonts from "@/libs/pdfmake/vfs_fonts";
import type { PatientRequest } from "~/libs/types/patient";
import { useDoctorStorage } from "./use-doctor-storage";
import { useMedicineStorage } from "./use-medicine-storage";
import { add } from "date-fns";

export function usePatientPdf() {

    // 1. Assign the VFS data to pdfMake
    (<any>pdfMake).vfs = pdfFonts.pdfMake ? pdfFonts.pdfMake.vfs : pdfFonts.vfs;
    // 2. Define the font mapping
    pdfMake.fonts = {
    // This 'Sarabun' label is what you will use in your styles
    Sarabun: {
        normal: 'Sarabun-Regular-normal.ttf', 
        bold: 'Sarabun-Regular-normal.ttf', 
        italics: 'Sarabun-Regular-normal.ttf',}
    };

    pdfMake.addFonts({
        Sarabun:{
            normal: 'Sarabun-Regular-normal.ttf',
            bold: 'Sarabun-Regular-normal.ttf',
            italics: 'Sarabun-Regular-normal.ttf',
        }
    })

    const { getDoctorById } = useDoctorStorage()
    const { getMedicineById } = useMedicineStorage()

    function generatePatientPdf(request: PatientRequest) {
    
      const doctor = getDoctorById(request.doctorId);
      const medicine = getMedicineById(request.medicineId);

    if ( !medicine || !request.date) return

    const initialDate = new Date(request.date);

    // calculate appointment dates based on intervals and interval unit
    const appointmentDate:Date[] = []
    const appointmentDateString:string[] = []
    for(const interval of medicine.intervals){
         const previousDate = appointmentDate.length === 0 ? initialDate : appointmentDate[appointmentDate.length - 1];
         const result = add(previousDate!, { 
        days: medicine.interval_unit === 'DAY' ? interval : 30*interval,    // use static 30 days for month calculation
      });
      appointmentDate.push(result);
      appointmentDateString.push(result.toLocaleDateString('th-TH', { day: 'numeric', month: 'short', year: '2-digit' }));
    }

      // 1. Define your custom Thai font
    const docDefinition: any = {
      // Small custom size (e.g., 80mm x 50mm for a label)
      pageSize: 'A4',
      pageMargins: [15, 15, 5, 5], // [left, top, right, bottom] - Minimal margins
      
      content: [
        {
          text: 'โรงพยาบาลปทุมธานี',
           margin:[180, 0, 0, 0]
        },
         {
          text: 'PATHUM THANI HOSPITAL',
          margin:[180, 5, 0, 0] 
        },
        {
          text:`ตารางฉีดวัคซีน ${medicine.name}`,
          margin:[0, 10, 0, 0], 
          style: 'header'
        },
        {
          text: medicine.description,
          margin: [0, 5, 0, 0] 
        },
        {
          text: '_________________________________________________________________________________',
         
        },
        ...appointmentDateString.map((dateString,index)=>{
          return {
          text: `เข็มที่ ${index + 1}: ${dateString}  ผู้ฉีด ${doctor ? doctor.name : '__________'} วันที่ฉีด __________`,
          margin: [15, 10, 0, 0] ,
          style: 'big'
          }
        }),
        {
          text: 'นำบัตรมาฉีดยาต่อตามวันที่ระบุ ที่แผนกผู้ป่วยนอก',
          margin: [15, 10, 0, 0]
        }
      ],

      defaultStyle: {
        font: 'Sarabun', // Must match the name in your VFS
        fontSize: 10
      },

      styles: {
        header: {
          fontSize: 16,
          bold: true
        },
        big:{
          fontSize: 14,
        }
      }
    };

    pdfMake.createPdf(docDefinition).open();
  }
    return { generatePatientPdf };
}