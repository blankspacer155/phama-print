import pdfMake from "pdfmake/build/pdfmake";
import * as pdfFonts from "@/libs/pdfmake/vfs_fonts";
import type { PatientRequest } from "~/libs/types/patient";
import { useDoctorStorage } from "./use-doctor-storage";
import { useMedicineStorage } from "./use-medicine-storage";
import { add } from "date-fns";
import { getThaiVisualLength } from "~/libs/utils";

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
      // Calculate duration based on unit
      // If 'MONTH', we use the 'months' property for calendar accuracy
      // Otherwise, we use 'days'
      const duration = medicine.interval_unit === 'DAY' 
        ? { days: interval } 
        : { months: interval }; 

      // Always add to initialDate, not the previous result
      const result = add(initialDate, duration);
      appointmentDate.push(result);
      appointmentDateString.push(result.toLocaleDateString('th-TH', { day: 'numeric', month: 'short', year: '2-digit' }));
    }

      // 1. Define your custom Thai font
    const blankLength = 12;
    const doctorNameLength = doctor ? getThaiVisualLength(doctor.name) : 0;
    const frontBlank = '_'.repeat((blankLength - doctorNameLength) / 2);
    const backBlank = '_'.repeat(blankLength - frontBlank.length - doctorNameLength);
    const doctorNameWithBlanks = doctor? frontBlank + doctor.name + backBlank: '_______________' 
    const docDefinition: any = {
      // pdfmake 1 cm = 28.346 points
      pageSize: {
        width: 255.11, // 9 cm
        height: 170.08 // 6 cm
      },
      pageMargins: [15, 5, 2, 2], // [left, top, right, bottom] - Minimal margins
      pageOrientation: 'landscape',
      content: [
        {
          text: 'โรงพยาบาลปทุมธานี',
           margin:[150, 0, 0, 0],
           style: 'big'
        },
         {
          text: 'PATHUM THANI HOSPITAL',
          margin:[150, 1, 0, 0] 
        },
         {
          text: 'สติกเกอร์',
          style: 'big',
          color: 'red',
          margin:[30, 10, 0, 0] 
        },
        {
          text:[
            {text:'นัดฉีด ',style:'big'},
            {text: medicine.name,style: 'header'}
          ],
          margin:[0, 30, 0, 0], 
        },
        {
          text: medicine.description,
          margin: [0, 1, 0, 2] 
        },
        ...appointmentDateString.map((dateString,index)=>{
          return {
          text: `เข็มที่ ${index + 1}: ${dateString}  ผู้ฉีด ${doctorNameWithBlanks} วันที่ฉีด _______________`,
          margin: [10, 0, 0, 0] ,
          style: 'big'
          }
        }),
        {
          text: 'นำบัตรมาฉีดยาต่อตามวันที่ระบุ ที่แผนกผู้ป่วยนอก',
          margin: [10, 3, 0, 0]
        }
      ],

      defaultStyle: {
        font: 'Sarabun', // Must match the name in your VFS
        fontSize: 7
      },

      styles: {
        header: {
          fontSize: 11,
          bold: true
        },
        big:{
          fontSize: 9,
        }
      }
    };

    pdfMake.createPdf(docDefinition).open();
  }
    return { generatePatientPdf };
}