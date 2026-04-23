<script setup lang="ts">
  const {setDefaultMedicines} = useMedicineStorage()
  setDefaultMedicines()
</script>
<template>
  <div>
   <NuxtLayout>
     <NuxtPage />
    </NuxtLayout>
  </div>
</template>
