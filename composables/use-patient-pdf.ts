import pdfMake from "pdfmake/build/pdfmake";
import * as pdfFonts from "@/libs/pdfmake/vfs_fonts";
import type { PatientRequest } from "~/libs/types/patient";

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

    function generatePatientPdf(data: PatientRequest) {
   
      // 1. Define your custom Thai font
    const docDefinition: any = {
      // Small custom size (e.g., 80mm x 50mm for a label)
      pageSize: 'A4',
      pageMargins: [5, 5, 5, 5], // [left, top, right, bottom] - Minimal margins
      
      content: [
        {
          text: `หมอผู้ฉีด: ${data?.doctorId || '....................'}`,
          style: 'header'
        },
        {
          text: `วันที่นัดหมาย: ${data?.date || '....................'}`,
          margin: [0, 5, 0, 0] // Top margin of 5pt
        },
        {
          text: `รหัสยา: ${data?.medicineId || '....................'}`,
          margin: [0, 5, 0, 0]
        }
      ],

      defaultStyle: {
        font: 'Sarabun', // Must match the name in your VFS
        fontSize: 10
      },

      styles: {
        header: {
          fontSize: 12,
          bold: true
        }
      }
    };

    pdfMake.createPdf(docDefinition).open();
  }
    return { generatePatientPdf };
}