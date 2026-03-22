

<script setup lang="ts">
import PatientForm from '~/components/patients/patient-form.vue';
import type { PatientRequest } from '~/libs/types/patient';

function handlePatientSubmit(patientData: PatientRequest) {
    console.log('Patient data submitted:', patientData);
}
</script>

<template>
    <main class="container pb-16 pt-16">
       <div class="flex flex-col justify-between items-center">
        <PatientForm @submit="handlePatientSubmit" />
       </div> 
    </main>
</template>