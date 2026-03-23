import { useStorage } from "@vueuse/core";
import type { Doctor } from "~/libs/types/doctor";

export function useDoctorStorage(){
    const doctorStorage = useStorage<Doctor[]>('phama-print-doctors', []);

    return {
        doctors: doctorStorage,
        doctorOptions: [ { id: '', name: '-' }, ...doctorStorage.value ].map((doctor: Doctor) => ({ name: doctor.name, value: doctor.id })),
        addDoctor: (doctor: Doctor) => {
           doctorStorage.value.push(doctor);
        },
        updateDoctor: (updatedDoctor: Doctor) => {
            const index = doctorStorage.value.findIndex((d: Doctor) => d.id === updatedDoctor.id);
            if (index !== -1) {
                doctorStorage.value[index] = updatedDoctor;
            }
        },
        deleteDoctor: (doctor: Doctor) => {
            const updatedDoctors = doctorStorage.value.filter((d: Doctor) => d.id !== doctor.id);
            doctorStorage.value = updatedDoctors;
        },
        getDoctorById: (id: string) => {
            return doctorStorage.value.find((d: Doctor) => d.id === id);
        }
    };
}