<script setup lang="ts">
  const {setDefaultMedicine} = useMedicineStorage()
  setDefaultMedicine()
</script>
<template>
  <div>
   <NuxtLayout>
     <NuxtPage />
    </NuxtLayout>
  </div>
</template>
